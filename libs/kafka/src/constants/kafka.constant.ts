export const KAFKA_BROKERS = process.env.KAFKA_BROKERS ?? 'localhost:9094';
export const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID ?? 'eventflowapp';
export const KAFKA_CONSUMER_GROUP = process.env.KAFKA_CONSUMER_GROUP ?? 'eventflowapp-consumer';

export const KAFKA_TOPICS = {
    //Auth events
    USER_REGISTERED: 'user.registered',
    USER_LOGIN: 'user.login',
    PASSWORD_RESET_REQUESTED: 'user.password-reset-requested',
    // Events events 
    EVENT_CREATED: 'event.created',
    EVENT_UPDATED: 'event.updated',
    EVENT_DELETED: 'event.deleted',
    // Notifications events
    SEND_EMAIL: 'notification.send-email',
    SEND_SMS: 'notification.send-sms',
    SEND_PUSH: 'notification.send-push',

    // tickets events
    TICKET_PURCHASED: 'ticket.purchased',
    TICKET_CANCELLED: 'ticket.cancelled',
    TICKET_CHECKED_IN: 'ticket.checked-in',

    // payments events
    PAYMENT_COMPLETED: 'payment.completed',
    PAYMENT_FAILED: 'payment.failed',
    PAYMENT_REFUNDED: 'payment.refunded',
} as const;

export type KafkaTopics = (typeof KAFKA_TOPICS) [keyof typeof KAFKA_TOPICS];