/** Error types that services can throw — mapped to HTTP status in api-helpers. */
export type ErrorType = 'NOT_FOUND' | 'FORBIDDEN' | 'BAD_REQUEST' | 'UNAUTHORIZED' | 'INTERNAL';

/** Thrown by service functions, caught by route handlers. */
export class ServiceError extends Error {
    type: ErrorType;

    constructor(message: string, type: ErrorType) {
        super(message);
        this.name = 'ServiceError';
        this.type = type;
    }
}