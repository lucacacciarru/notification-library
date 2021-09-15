import { uuid } from 'uuidv4';

export class NotificationSingle {
  body: BodyNotification;
  id: string = uuid();
  sender = '';
  created_at = Date.now();
  read = false;
  read_at = null;
  constructor(body: BodyNotification) {
    this.body = body;
  }
}

interface BodyNotification {
  title: string;
  text: string;
}

export interface ChannelNotifications {
  [key: string]: NotificationSingle[];
}
