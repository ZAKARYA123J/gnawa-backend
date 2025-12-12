export interface IArtist {
  id: string;
  name: string;
  biography: string;
  genre: string;
  photos?: string[];
  performances?: string[];
  website?: string;
  socialMedia?: Record<string, string>;
  isHeadliner: boolean;
  performanceTime?: Date;
  performanceDuration?: number;
  status: 'active' | 'inactive' | 'pending';
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IArtistCreationAttributes extends Omit<IArtist, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}