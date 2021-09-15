import fetchMock, { MockResponseInit } from 'jest-fetch-mock';
import { NotificationCenter } from '../../src/classes/NotificationCenter';
import { NotificationSingle } from '../../src/classes/NotificationSingle';

const notificationCenter = NotificationCenter.getIstance();
const fakeFetchUrl = 'https://fake-server.com/';
const channelName = 'channel';
const config = {
  fetchUrl: 'url',
  createUrl: fakeFetchUrl,
  readUrl: 'url',
};

const notificationSingle = new NotificationSingle({
  title: 'anyString',
  text: 'anyText',
});

const callback = () => {
  console.log('anystring');
};

beforeAll(() => {
  fetchMock.enableMocks();
  fetchMock.mockIf(
    fakeFetchUrl,
    async (): Promise<MockResponseInit> => {
      return {
        body: JSON.stringify(notificationSingle),
        status: 200,
      };
    }
  );
});

describe('pushNotification', () => {
  test('Add notification in local/remote and subscribers doesn t exist', async () => {
    notificationCenter.addChannel(channelName, config);

    await notificationCenter.pushNotification(notificationSingle, channelName);
    expect(notificationCenter.notifications[channelName]).toEqual([
      notificationSingle,
    ]);
  });

  test('Add notification in local/remote and fire subscribers', async () => {
    const anotherChannel = 'default';
    notificationCenter.addChannel(anotherChannel, config);
    notificationCenter.createSubscribers(anotherChannel, callback);
    await notificationCenter.pushNotification(
      notificationSingle,
      anotherChannel
    );
    expect(notificationCenter.notifications[anotherChannel]).toEqual([
      notificationSingle,
    ]);
  });

  test('try to insert a notification in a non-existent channel', () => {
    const fakeChannel = 'fakeChannel';
    notificationCenter.pushNotification(notificationSingle, fakeChannel);
    expect(notificationCenter.channels[fakeChannel]).toBeUndefined();
  });
});
