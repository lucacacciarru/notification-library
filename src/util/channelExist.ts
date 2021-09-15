import { Channel } from '../interface/Channel';

export function channelExists(channelList: Channel, channelName: string) {
  if (channelList[channelName]) return true;
  else {
    console.error(`Il canale nominato "${channelName}" non esiste`);
    return false;
  }
}
