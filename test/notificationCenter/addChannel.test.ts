import { NotificationCenter } from '../../src/classes/NotificationCenter';

const notificationCenter = new NotificationCenter();
const channelname = 'default';
const config = {
  fetchUrl: 'url',
  createUrl: 'url',
  readUrl: 'url',
};

describe('NotificationCenter', () => {
  test('create channel', () => {
    notificationCenter.addChannel(channelname, config);
    expect(notificationCenter.channels[channelname]).toEqual(config);
  });
});
