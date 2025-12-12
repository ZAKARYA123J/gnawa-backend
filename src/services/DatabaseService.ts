import { initializeDatabase, createDefaultAdmin, sequelize, Event, Artist, Booking, Admin } from '../models';

export class DatabaseService {
  static async connect(): Promise<void> {
    try {
      await initializeDatabase();
      await createDefaultAdmin();
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
      throw error;
    }
  }

  static async disconnect(): Promise<void> {
    try {
      await sequelize.close();
      console.log('✅ Connexion à la base de données fermée.');
    } catch (error) {
      console.error('❌ Erreur lors de la fermeture de la connexion:', error);
      throw error;
    }
  }

  // Méthodes utilitaires
  static async healthCheck(): Promise<boolean> {
    try {
      await sequelize.authenticate();
      return true;
    } catch {
      return false;
    }
  }

  static get models() {
    return { Event, Artist, Booking, Admin };
  }

  static get connection() {
    return sequelize;
  }
}