import { NotificationCenter } from '../../src/classes/NotificationCenter';

const notificationCenter = NotificationCenter.getIstance();
const channelName = 'default';
const config = {
  fetchUrl: 'url',
  createUrl: 'url',
  readUrl: 'url',
};
const callback = () => {
  console.log('anyFunction');
};

describe('createSubscribers', () => {
  test('add subscribers', () => {
    notificationCenter.addChannel(channelName, config);
    notificationCenter.createSubscribers(channelName, callback);
    expect(notificationCenter.subscribers[channelName]).toContain(callback);
  });

  test('try to insert a subscriber in a non-existent channel', () => {
    const fakeChannel = 'fakeChannel';
    notificationCenter.createSubscribers(fakeChannel, callback);
    expect(notificationCenter.subscribers[fakeChannel]).toBeUndefined();
  });
});
