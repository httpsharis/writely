// Define the specific types of errors our app handles
export type ErrorType = 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'INTERNAL';

export class ServiceError extends Error {
  type: ErrorType;

  constructor(message: string, type: ErrorType) {
    super(message);
    this.name = 'ServiceError'; // Specify that the error is in service 
    this.type = type;
  }
}