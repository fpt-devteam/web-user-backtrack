import { useMutation } from '@tanstack/react-query';
import { notificationService } from '@/services/notification.service';
import {
  type NotificationSendPushRequest,
  type NotificationResponse,
} from '@/types/notification.type';

export const useSendNotification = () => {
  return useMutation<NotificationResponse, Error, NotificationSendPushRequest>({
    mutationFn: (dto) => notificationService.sendNotification(dto),
  });
};
