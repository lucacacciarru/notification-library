import fetchMock, { MockResponseInit } from 'jest-fetch-mock';
import { NotificationCenter } from '../../src/classes/NotificationCenter';
import { NotificationSingle } from '../../src/classes/NotificationSingle';

const notificationCenter = NotificationCenter.getIstance();
const fakeCreateUrl = 'https://fake-server.com/';
const fakeReadUrl = 'https://fake-server.com/read/';
const channelName = 'channel';
const config = {
  fetchUrl: fakeCreateUrl,
  createUrl: fakeCreateUrl,
  readUrl: fakeReadUrl,
};

const notificationSingle = new NotificationSingle({
  title: 'anyString',
  text: 'anyText',
});

fetchMock.enableMocks();
fetchMock.mockIf(
  /.*/,
  async (request): Promise<MockResponseInit> => {
    console.log('************************', request.url);
    if (request.url.includes(fakeCreateUrl)) {
      return {
        body: JSON.stringify(notificationSingle),
        status: 200,
      };
    }
    if (request.url.includes(fakeReadUrl)) {
      return {
        body: JSON.stringify(notificationSingle),
        status: 200,
      };
    }
  }
);

describe('readNotification', () => {
  const fakeId = 'fakeId';

  test('search non-existent notificationsList', () => {
    notificationCenter.addChannel(channelName, config);

    notificationCenter.readNotification(channelName, fakeId);
    expect(notificationCenter.notifications[channelName]).toBeUndefined();
  });

  test('push and read notification', async () => {
    notificationCenter.addChannel(channelName, config);
    await notificationCenter.pushNotification(notificationSingle, channelName);
    await notificationCenter.readNotification(
      channelName,
      notificationSingle.id
    );
    const notification = notificationCenter.notifications[channelName].find(
      current => current.id === notificationSingle.id
    );
    expect(notification.read).toBe(true);
    expect(notification.read_at).not.toBeUndefined();
  });

  describe('when notification is already read', () => {
    beforeAll(async () => {
      notificationCenter.addChannel(channelName, config);
      await notificationCenter.pushNotification(
        notificationSingle,
        channelName
      );
      await notificationCenter.readNotification(
        channelName,
        notificationSingle.id
      );
    });

    test('tries to read an already read notification', async () => {
      const notification = notificationCenter.notifications[channelName].find(
        current => current.id === notificationSingle.id
      );

      const newNotification = await notificationCenter.readNotification(
        channelName,
        notificationSingle.id
      );
      expect(notification).toEqual(newNotification);
    });
  });

  test('search for a non-existent channel', async () => {
    const fakeChannel = 'fakeChannel';
    await notificationCenter.readNotification(fakeChannel, fakeId);
    expect(notificationCenter.notifications[fakeChannel]).toBeUndefined();
  });

  test('search for a non-existent id notification', async () => {
    const fakeId = 'fakeId';
    const newNotification = await notificationCenter.readNotification(
      channelName,
      fakeId
    );
    expect(newNotification).toBe(false);
  });
});
