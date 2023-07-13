//CREATE TYPE user_type AS ENUM ('carrier', 'customer');

export enum UserType {
  CARRIER = 'carrier',
  CUSTOMER = 'customer,',
}

// CREATE TYPE status AS ENUM ('pending', 'accepted', 'enroute', 'arrived', 'completed');

export enum AppointmentStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  ENROUTE = 'enroute',
  ARRIVED = 'arrived',
  COMPLETED = 'completed',
}
