import { notification } from 'antd';
import type { NotificationArgsProps } from 'antd';

type NotificationPlacement = NotificationArgsProps['placement'];

export const Notification = () => {
  const [api, contextHolder] = notification.useNotification();
  const openNotification = (
    placement: NotificationPlacement,
    message: string,
    description?: string,
    type?: string,
  ) => {
    switch (type) {
      case 'success':
        api.success({
          message,
          description,
          placement,
        });
        break;

      case 'error':
        api.error({
          message,
          description,
          placement,
        });
        break;

      case 'info':
        api.info({
          message,
          description,
          placement,
        });
        break;

      default:
        break;
    }
  };

  return { contextHolder, openNotification };
};
