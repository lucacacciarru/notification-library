import { Channel } from '../interface/Channel';

export async function fetchData(channelList: Channel, channelName: string) {
  const responseUrl = await fetch(channelList[channelName].fetchUrl);
  const responseNotification = await responseUrl.json();
  return responseNotification;
}
