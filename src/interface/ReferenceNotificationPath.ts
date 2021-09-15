export interface BodyNotification {
  read_at: number;
  read: boolean;
}

export interface ReferenceNotification {
  urlNotification: string;
  contentNotification: BodyNotification;
}
