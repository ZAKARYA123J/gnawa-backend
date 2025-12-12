export interface IBooking {
  id: string;
  confirmationCode: string;
  email: string;
  attendeeName: string;
  phoneNumber?: string;
  quantity: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'checked_in';
  paymentMethod?: 'credit_card' | 'cash' | 'bank_transfer' | 'online';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  specialRequests?: string;
  checkedInAt?: Date;
  notes?: string;
  eventId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export interface IBookingCreationAttributes extends Omit<IBooking, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'> {}