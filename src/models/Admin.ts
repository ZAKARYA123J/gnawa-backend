import { DataTypes, Model } from 'sequelize';
import sequelize from "../database/sequilize.ts";

import bcrypt from 'bcrypt';
import { IAdmin, IAdminCreationAttributes } from '../interfaces/IAdmin.ts';
import { env } from "../../configue.ts"
import jwt from "jsonwebtoken"
export class Admin extends Model<IAdmin, IAdminCreationAttributes> implements IAdmin {
  public id!: string;
  public username!: string;
  public email!: string;
  public password!: string;
  public firstName?: string;
  public lastName?: string;
  public role!: 'super_admin' | 'admin' | 'moderator';
  public isActive!: boolean;
  public lastLogin?: Date;
  public resetPasswordToken?: string;
  public resetPasswordExpires?: Date;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt?: Date;

  // Méthode d'instance pour vérifier le mot de passe
  public async verifyPassword(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
  }

  // Méthode d'instance pour générer un JWT
  public generateAuthToken(): string {
    
    return jwt.sign(
      {
        id: this.id,
        username: this.username,
        email: this.email,
        role: this.role,
      },
      env.JWT_SECRET!,
      { expiresIn: env.JWT_EXPIRES_IN || '24h' }
    );
  }

  static initialize(): void {
    Admin.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING(50),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "Le nom d'utilisateur est requis",
            },
            len: {
              args: [3, 50],
              msg: "Le nom d'utilisateur doit contenir entre 3 et 50 caractères",
            },
            is: {
              args: /^[a-zA-Z0-9_.-]+$/,
              msg: "Le nom d'utilisateur ne peut contenir que des lettres, chiffres, points, tirets et underscores",
            },
          },
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true,
          validate: {
            notEmpty: {
              msg: "L'email est requis",
            },
            isEmail: {
              msg: "L'email doit être valide",
            },
          },
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false,
          validate: {
            notEmpty: {
              msg: "Le mot de passe est requis",
            },
            len: {
              args: [8, 255],
              msg: "Le mot de passe doit contenir au moins 8 caractères",
            },
          },
        },
        firstName: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        lastName: {
          type: DataTypes.STRING(100),
          allowNull: true,
        },
        role: {
          type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
          defaultValue: 'admin',
          allowNull: false,
        },
        isActive: {
          type: DataTypes.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        lastLogin: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        resetPasswordToken: {
          type: DataTypes.STRING(255),
          allowNull: true,
        },
        resetPasswordExpires: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: 'admins',
        timestamps: true,
        paranoid: true,
        indexes: [
          {
            unique: true,
            fields: ['username'],
          },
          {
            unique: true,
            fields: ['email'],
          },
          {
            fields: ['role'],
          },
          {
            fields: ['isActive'],
          },
        ],
        hooks: {
          beforeCreate: async (admin: Admin) => {
            if (admin.password) {
              admin.password = await bcrypt.hash(admin.password, 10);
            }
          },
          beforeUpdate: async (admin: Admin) => {
            if (admin.changed('password')) {
              admin.password = await bcrypt.hash(admin.password, 10);
            }
          },
        },
      }
    );
  }

  static associate(models: any): void {
    // Pas d'associations nécessaires pour Admin
  }
}