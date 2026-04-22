import { z } from 'zod';

/*
 * ENUMS & TYPES
 */
export const NOTIFICATION_STATUS = {
  Unread: 'Unread',
  Read: 'Read',
  Archived: 'Archived',
} as const;

export type NotificationStatus = (typeof NOTIFICATION_STATUS)[keyof typeof NOTIFICATION_STATUS];

export const NOTIFICATION_EVENT = {
  ChatEvent: 'ChatEvent',
  AIMatchingEvent: 'AIMatchingEvent',
  QRScanEvent: 'QRScanEvent',
  SystemAlertEvent: 'SystemAlertEvent',
} as const;

export const NOTIFICATION_CATEGORY = {
  InApp: 'InApp',
  Push: 'Push',
} as const;

export type NotificationEvent = (typeof NOTIFICATION_EVENT)[keyof typeof NOTIFICATION_EVENT];
export type NotificationCategory = (typeof NOTIFICATION_CATEGORY)[keyof typeof NOTIFICATION_CATEGORY];

/*
 * SCHEMAS
 */
export const NotificationIdsSchema = z
  .array(z.string().min(1, 'NotificationId must be a non-empty string'))
  .min(1, 'NotificationIds must contain at least 1 id');

export const NotificationStatusUpdateRequestSchema = z.object({
  notificationIds: NotificationIdsSchema,
  status: z.enum(Object.values(NOTIFICATION_STATUS) as [string, ...string[]]),
});

export type NotificationStatusUpdateRequest = z.infer<typeof NotificationStatusUpdateRequestSchema>;

export const NotificationSendPushRequestSchema = z.object({
  target: z.object({ userId: z.string().min(1, 'UserId is required').trim() }),
  source: z.object({
    name: z.string().min(1, 'Source name is required').trim(),
    eventId: z.string().min(1, 'SourceEventId is required').trim(),
  }),
  title: z.string().trim().min(1, 'Title is required'),
  body: z.string().trim().min(1, 'Body is required'),
  data: z.record(z.string(), z.unknown()).optional(),
  type: z.enum(Object.values(NOTIFICATION_EVENT) as [string, ...string[]]),
  category: z.enum(Object.values(NOTIFICATION_CATEGORY) as [string, ...string[]]),
});

export type NotificationSendPushRequest = z.infer<typeof NotificationSendPushRequestSchema>;

export const NotificationOptionsSchema = z.object({
  cursor: z.string().optional(),
  status: z.enum(Object.values(NOTIFICATION_STATUS) as [string, ...string[]]).optional(),
});

export type NotificationOptions = z.infer<typeof NotificationOptionsSchema>;

/*
 * RESPONSE TYPES
 */
export interface NotificationResponse {
  id: string;
  title: string;
  body: string;
  createdAt: string;
  status: NotificationStatus;
  type: NotificationEvent;
  category: NotificationCategory;
  data?: Record<string, unknown>;
}
