//Interfaces
import { Config } from '../interface/ConfigUrl';
import { ChannelNotifications, NotificationSingle } from './NotificationSingle';
import { Channel } from '../interface/Channel';
import { CallbackContainer } from '../interface/CallbackContainer';

//Util
import { channelExists } from '../util/channelExist';
import { findNotificationById } from '../util/findNotificationById';
import { changeSenderNotification } from '../util/changeSenderNotification';

//Util fetch
import { fetchData } from '../util/fetchData';
import { postdata } from '../util/postData';
import { pathRemoteNotification } from '../util/pathRemoteNotification';
import { pathLocalNotification } from '../util/pathLocalNotification';
import { replaceNotification } from '../util/replaceNotification';

export class NotificationCenter {
  notifications: ChannelNotifications = {};
  sender: string = '';
  channels: Channel = {};
  subscribers: CallbackContainer = {};

  private static instance: NotificationCenter;

  public static getIstance() {
    if (!NotificationCenter.instance) {
      NotificationCenter.instance = new NotificationCenter();
    }
    return NotificationCenter.instance;
  }

  addChannel(channelName: string, newUrl: Config) {
    this.channels = {
      ...this.channels,
      [channelName]: newUrl,
    };
    console.log('Canale aggiunto');
    return this.channels;
  }

  async getAllNotifications(channelName: string) {
    if (
      Array.isArray(this.notifications[channelName]) &&
      this.notifications[channelName].length > 0
    ) {
      return this.notifications[channelName];
    }

    if (channelExists(this.channels, channelName)) {
      const responseNotification = await fetchData(this.channels, channelName);
      this.notifications[channelName] = responseNotification;
      return this.notifications[channelName];
    }
  }

  async pushNotification(
    notification: NotificationSingle,
    channelName: string
  ) {
    if (channelExists(this.channels, channelName)) {
      const notificationNewSender = changeSenderNotification(
        notification,
        this.sender
      );

      const responseNotification = await postdata(
        this.channels[channelName].createUrl,
        notificationNewSender
      );

      this.notifications[channelName] = [
        ...(this.notifications[channelName] || []),
        responseNotification,
      ];
      console.log(
        `La notifica con id ${responseNotification.id} è stata aggiunta nel canale <<<${channelName}>>>`
      );

      this.notifySubscribers(channelName);
      return notificationNewSender;
    }
  }

  createSubscribers(channelName: string, ...callback: Function[]) {
    if (channelExists(this.channels, channelName)) {
      this.subscribers = {
        ...this.subscribers,
        [channelName]: [...(this.subscribers[channelName] || []), ...callback],
      };
    }
  }

  notifySubscribers(channelName: string) {
    if (this.subscribers[channelName] === undefined) {
      console.error(
        `Nessuna callback presente all'interno del canale <<< ${channelName} >>>`
      );
      return this;
    }
    const selectSubscribers = this.subscribers[channelName];
    selectSubscribers.forEach(fn => fn());
    return this;
  }

  setSender(sender: string) {
    this.sender = sender;
  }

  async readNotification(channelName: string, id: string) {
    const selectNotificationsList = this.notifications[channelName];

    if (!selectNotificationsList) {
      console.error(
        `Non esiste la lista di notifiche per il canale <<<${channelName}>>>`
      );
      return false;
    }
    const timestamp = Date.now();
    const notificationIndex = findNotificationById(selectNotificationsList, id);

    if (notificationIndex === -1) {
      console.error(`La notifica con id ${id} non esiste`);
      return false;
    }

    const selectNotificationSingle = selectNotificationsList[notificationIndex];

    if (selectNotificationsList[notificationIndex].read) {
      console.error(`Notifica con id ${id} già letta`);
      return selectNotificationSingle;
    }

    const referencesNotificationRemote = {
      urlNotification: this.channels[channelName].readUrl + '/' + id,
      contentNotification: {
        read_at: timestamp,
        read: true,
      },
    };

    await pathRemoteNotification(referencesNotificationRemote);

    const newNotification = pathLocalNotification(
      selectNotificationSingle,
      timestamp
    );

    // Replace the old notification with the new
    const newNotificationList = replaceNotification(
      this.notifications[channelName],
      newNotification
    );

    this.notifications[channelName] = newNotificationList;

    console.log(`Notifica con id ${id} letta`);
    return newNotification;
  }
}

export const notificationCenter = new NotificationCenter();
