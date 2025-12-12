export interface IAdmin {
  id: string;
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'admin' | 'moderator';
  isActive: boolean;
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IAdminCreationAttributes extends Omit<IAdmin, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}

export interface IAdminLoginAttributes {
  username?: string;
  email?: string;
  password: string;
}