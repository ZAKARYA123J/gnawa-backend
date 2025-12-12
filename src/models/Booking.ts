import { DataTypes, Model, Sequelize } from 'sequelize';
import { IBooking, IBookingCreationAttributes } from '../interfaces/IBooking.ts';

export class Booking extends Model<IBooking, IBookingCreationAttributes> implements IBooking {
  public id!: string;
  public confirmationCode!: string;
  public email!: string;
  public attendeeName!: string;
  public phoneNumber?: string;
  public quantity!: number;
  public totalPrice!: number;
  public status!: 'pending' | 'confirmed' | 'cancelled' | 'checked_in';
  public paymentMethod?: 'credit_card' | 'cash' | 'bank_transfer' | 'online';
  public paymentStatus!: 'pending' | 'paid' | 'failed' | 'refunded';
  public specialRequests?: string;
  public checkedInAt?: Date;
  public notes?: string;
  public eventId!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  static initialize(sequelize: Sequelize): void {
    Booking.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        confirmationCode: {
          type: DataTypes.STRING(20),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "Le code de confirmation est requis",
            },
          },
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "L'email est requis",
            },
            isEmail: {
              msg: "L'email doit être valide",
            },
          },
        },
        attendeeName: {
          type: DataTypes.STRING(200),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Le nom du participant est requis",
            },
            len: {
              args: [2, 200],
              msg: "Le nom doit contenir entre 2 et 200 caractères",
            },
          },
        },
        phoneNumber: {
          type: DataTypes.STRING(20),
          allowNull: true,
          validate: {
            is: {
              args: /^[0-9+\-\s()]+$/,
              msg: "Le numéro de téléphone doit être valide",
            },
          },
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 1,
          validate: {
            isInt: {
              msg: "La quantité doit être un entier",
            },
            min: {
              args: [1],
              msg: "La quantité minimale est de 1",
            },
            max: {
              args: [10],
              msg: "La quantité maximale est de 10 par réservation",
            },
          },
        },
        totalPrice: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          validate: {
            isDecimal: {
              msg: "Le prix total doit être un nombre décimal",
            },
            min: {
              args: [0],
              msg: "Le prix total ne peut pas être négatif",
            },
          },
        },
        status: {
          type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'checked_in'),
          defaultValue: 'confirmed',
          allowNull: false,
        },
        paymentMethod: {
          type: DataTypes.ENUM('credit_card', 'cash', 'bank_transfer', 'online'),
          allowNull: true,
        },
        paymentStatus: {
          type: DataTypes.ENUM('pending', 'paid', 'failed', 'refunded'),
          defaultValue: 'pending',
          allowNull: false,
        },
        specialRequests: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        checkedInAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        notes: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        eventId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: 'events',
            key: 'id',
          },
        },
      },
      {
        sequelize,
        tableName: 'bookings',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            unique: true,
            fields: ['confirmationCode'],
          },
          {
            fields: ['email'],
          },
          {
            fields: ['status'],
          },
          {
            fields: ['paymentStatus'],
          },
          {
            fields: ['createdAt'],
          },
          {
            fields: ['eventId'],
          },
        ],
        hooks: {
          beforeValidate: async (booking: Booking) => {
            // Générer un code de confirmation si non fourni
            if (!booking.confirmationCode) {
              booking.confirmationCode = Booking.generateConfirmationCode();
            }

            // Normaliser l'email
            if (booking.email) {
              booking.email = booking.email.toLowerCase().trim();
            }
          },
        },
      }
    );
  }
  
  private static generateConfirmationCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  static associate(models: any): void {
    Booking.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event',
    });
  }
}