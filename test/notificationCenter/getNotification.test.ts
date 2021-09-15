import { NotificationCenter } from '../../src/classes/NotificationCenter';
import fetchMock, { MockResponseInit } from 'jest-fetch-mock';

const notificationCenter = NotificationCenter.getIstance();
const fakeFetchUrl = 'https://fake-server.com/';
const channelName = 'channel';
const notification = { title: 'notification1' };

const config = {
  fetchUrl: fakeFetchUrl,
  createUrl: 'url',
  readUrl: 'url',
};

beforeAll(() => {
  fetchMock.enableMocks();
  fetchMock.mockIf(
    fakeFetchUrl,
    async (): Promise<MockResponseInit> => {
      return {
        body: JSON.stringify([notification]),
        status: 200,
      };
    }
  );
});

describe('getAllNotification', () => {
  test('get notification from URL', async () => {
    notificationCenter.addChannel(channelName, config);
    const notificationList = await notificationCenter.getAllNotifications(
      channelName
    );
    expect(notificationList).toEqual([{ title: 'notification1' }]);
  });

  test('return notification if already exist', async () => {
    notificationCenter.addChannel(channelName, config);
    await notificationCenter.getAllNotifications(channelName);
    expect(notificationCenter.notifications[channelName].length).toBe(1);
  });

  test('get notifications from a non-existing channel', async () => {
    const fakeChannel = 'fakeChannel';
    await notificationCenter.getAllNotifications(fakeChannel);
  });
});
