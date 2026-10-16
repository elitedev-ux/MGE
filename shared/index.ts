// API contracts for Phase 2. Monetary values are integer kobo.
export type Role = 'CUSTOMER' | 'ADMIN'
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED'
export type FulfillmentStatus = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED' | 'RETURNED'
export type ApiError = { error: { code:string; message:string } }
