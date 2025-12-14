import { DataTypes, Model, Sequelize } from 'sequelize';
import { IEvent, IEventCreationAttributes } from '../interfaces/IEvent.ts';

export class Event extends Model<IEvent, IEventCreationAttributes> implements IEvent {
  public id!: string;
  public name!: string;
  public description!: string;
  public date!: Date;
  public location!: string;
  public address?: string;
  public price!: number;
  public maxCapacity?: number;
  public availableTickets?: number;
  public status!: 'planned' | 'ongoing' | 'cancelled' | 'completed';
  public imageUrl?: string;

  // Timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;
     static readonly #DEFAULT_PREFIX = "Mr/Ms";

   static initialize(sequelize: Sequelize): void {
    Event.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(200),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Le nom de l'événement est requis",
            },
            len: {
              args: [2, 200],
              msg: "Le nom doit contenir entre 2 et 200 caractères",
            },
          },
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "La description est requise",
            },
            len: {
              args: [10, 5000],
              msg: "La description doit contenir entre 10 et 5000 caractères",
            },
          },
        },
        date: {
          type: DataTypes.DATE,
          allowNull: false,
          validate: {
            // isDate: {
            //   msg: "La date doit être valide",
            // },
            isFuture(value: Date) {
              if (new Date(value) < new Date()) {
                throw new Error("La date de l'événement doit être dans le futur");
              }
            },
          },
        },
        location: {
          type: DataTypes.STRING(300),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Le lieu est requis",
            },
          },
        },
        address: {
          type: DataTypes.STRING(500),
          allowNull: true,
        },
        price: {
          type: DataTypes.DECIMAL(10, 2),
          allowNull: false,
          defaultValue: 0.0,
          validate: {
            isDecimal: {
              msg: "Le prix doit être un nombre décimal",
            },
            min: {
              args: [0],
              msg: "Le prix ne peut pas être négatif",
            },
          },
        },
        maxCapacity: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            isInt: {
              msg: "La capacité doit être un entier",
            },
            min: {
              args: [1],
              msg: "La capacité minimale est de 1",
            },
          },
        },
        availableTickets: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            isInt: {
              msg: "Le nombre de tickets doit être un entier",
            },
            min: {
              args: [0],
              msg: "Le nombre de tickets ne peut pas être négatif",
            },
          },
        },
        status: {
          type: DataTypes.ENUM('planned', 'ongoing', 'cancelled', 'completed'),
          defaultValue: 'planned',
          allowNull: false,
        },
        imageUrl: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: {
              msg: "L'URL de l'image doit être valide",
            },
          },
        },
      },
      {
        sequelize,
        tableName: 'events',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            unique: true,
            fields: ['name', 'date'],
          },
          {
            fields: ['date'],
          },
          {
            fields: ['status'],
          },
        ],
        hooks: {
          beforeUpdate: (event: Event) => {
            if (event.changed('maxCapacity') && event.availableTickets! > event.maxCapacity!) {
              event.availableTickets = event.maxCapacity;
            }
          },
        },
      }
    );
  }


  static associate(models: any): void {
    Event.hasMany(models.Booking, {
      foreignKey: 'eventId',
      as: 'bookings',
      onDelete: 'RESTRICT',
      onUpdate: 'CASCADE',
    });

    Event.belongsToMany(models.Artist, {
      through: 'EventArtists',
      foreignKey: 'eventId',
      otherKey: 'artistId',
      as: 'artists',
    });
  }
}
