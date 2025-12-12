export interface IEvent {
  id: string;
  name: string;
  description: string;
  date: Date;
  location: string;
  address?: string;
  price: number;
  maxCapacity?: number;
  availableTickets?: number;
  status: 'planned' | 'ongoing' | 'cancelled' | 'completed';
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IEventCreationAttributes extends Omit<IEvent, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}