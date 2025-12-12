import { DataTypes, Model, Sequelize } from 'sequelize';
import { IArtist, IArtistCreationAttributes } from '../interfaces/IArtist.ts';

export class Artist extends Model<IArtist, IArtistCreationAttributes> implements IArtist {
  public id!: string;
  public name!: string;
  public biography!: string;
  public genre!: string;
  public photos?: string[];
  public performances?: string[];
  public website?: string;
  public socialMedia?: Record<string, string>;
  public isHeadliner!: boolean;
  public performanceTime?: Date;
  public performanceDuration?: number;
  public status!: 'active' | 'inactive' | 'pending';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  static initialize(sequelize: Sequelize): void {
    Artist.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING(150),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Le nom de l'artiste est requis",
            },
            len: {
              args: [2, 150],
              msg: "Le nom doit contenir entre 2 et 150 caractères",
            },
          },
        },
        biography: {
          type: DataTypes.TEXT,
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "La biographie est requise",
            },
            len: {
              args: [50, 10000],
              msg: "La biographie doit contenir entre 50 et 10000 caractères",
            },
          },
        },
        genre: {
          type: DataTypes.STRING(100),
          allowNull: false,
          defaultValue: 'Gnawa',
          validate: {
            notEmpty: {
              msg: "Le genre musical est requis",
            },
          },
        },
        photos: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: [],
          validate: {
            // isArray(value: any) {
            //   if (!Array.isArray(value)) {
            //     throw new Error('Les photos doivent être un tableau');
            //   }
            // },
            isValidPhotos(value: string[] | undefined) {
              if (value && Array.isArray(value)) {
                value.forEach((url: string) => {
                  if (typeof url !== 'string' || !url.match(/^https?:\/\//)) {
                    throw new Error('Chaque photo doit être une URL valide');
                  }
                });
              }
            },
          },
        },
        performances: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: [],
        //   validate: {
        //     isArray(value: any) {
        //       if (!Array.isArray(value)) {
        //         throw new Error('Les performances doivent être un tableau');
        //       }
        //     },
        //   },
        },
        website: {
          type: DataTypes.STRING(500),
          allowNull: true,
          validate: {
            isUrl: {
              msg: "L'URL du site web doit être valide",
            },
          },
        },
        socialMedia: {
          type: DataTypes.JSON,
          allowNull: true,
          defaultValue: {},
        },
        isHeadliner: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
          allowNull: false,
        },
        performanceTime: {
          type: DataTypes.DATE,
          allowNull: true,
          validate: {
            // isDate: {
            //   msg: "L'heure de performance doit être une date valide",
            // },
          },
        },
        performanceDuration: {
          type: DataTypes.INTEGER,
          allowNull: true,
          validate: {
            isInt: {
              msg: "La durée doit être un nombre entier",
            },
            min: {
              args: [1],
              msg: "La durée minimale est de 1 minute",
            },
          },
        },
        status: {
          type: DataTypes.ENUM('active', 'inactive', 'pending'),
          defaultValue: 'active',
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'artists',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            fields: ['name'],
          },
          {
            fields: ['genre'],
          },
          {
            fields: ['isHeadliner'],
          },
          {
            fields: ['status'],
          },
        ],
        hooks: {
          beforeValidate: (artist: Artist) => {
            if (artist.genre) {
              artist.genre = artist.genre.charAt(0).toUpperCase() + artist.genre.slice(1).toLowerCase();
            }
          },
        },
      }
    );
  }
  static associate(models: any): void {
    Artist.belongsToMany(models.Event, {
      through: 'EventArtists',
      foreignKey: 'artistId',
      otherKey: 'eventId',
      as: 'events',
    });
  }
}