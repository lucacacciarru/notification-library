
class NotificationCenter {
  constructor(notifications, sender, channels) {
    this.notifications = [];
    this.sender = '';
    this.channels = {
      default: {
        fetch: 'http://localhost:8000/default',
        readUrl: 'http://localhost:8000/default',
        createUrl: 'http://localhost:8000/default',
      },
    };
    this.subscribers = {}
  }

  async get(channel) {
    if (
      this.notifications[channel] instanceof Array &&
      this.notifications[channel].lenght > 0
    ) {
      return this.notifications[channel];
    }
    if (this.channelExists(channel)) {
      const response = await fetch(this.channels[channel].fetchUrl);
      const responseNotifications = await response.json();
      responseNotifications.forEach((notification) => {
        notification.sender = this.sender
      })
      this.notifications[channel] = responseNotifications;
      this.notifySubscribers(channel)
    }
    return this.notifications[channel];
  }

  async push(notification, channel) {
    try {
      if (this.channelExists(channel)) {
        const response = await fetch(this.channels[channel].createUrl, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notification),
        });
        const responsNotification = await response.json();
        this.notifications[channel] = [
          ...this.notifications[channel],
          responsNotification,
        ];
        console.log(`La notifica è stata aggiunta nel canale <<<${channel}>>>`)
        this.notifySubscribers(channel)
        return this.notifications[channel];
      }
    } catch (error) {
      console.error(error);
    }
  }

  async read(channel, id) {
    const selectNotifications = this.notifications[channel];
    const timestamp = Date.now();

    this.get(channel);
    const notificationIndex = this.findNotificationById(selectNotifications, id)
    if (selectNotifications[notificationIndex].read) {
      console.error(`Notifica con if ${id} già letta`);
      return this
    }

    await this.setNotificationReaded(timestamp, id, this.channels[channel].readUrl + '/' + id);
    this.notifySubscribers(channel)
  }

  channelExists(channel) {
    if (this.channels[channel])
      return true
    else {
      console.error(`Il canale nominato "${channel}" non esiste`)
    }
  }

  findNotificationById(channelNotifications, id) {
    const notification = channelNotifications.findIndex(notification => { return notification.id === id })
    if (notification === -1) {
      console.error(`La notifica con id ${id} non esite`);
    }
    return notification
  }

  async setNotificationReaded(timestamp, id, url) {
    try {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read_at: timestamp, read: true }),
      });
      console.log(`Notifica con id ${id} letta`)
      return response
    }
    catch (err) {
      console.error(err)
    }
  }

  createSubscribe(channel) {
    if (this.subscribers[channel]) {
      console.error(`Il canale "${channel}" esiste già`);
      return this
    }

    if (this.channelExists(channel)) {
      this.subscribers = {
        ...this.subscribers,
        [channel]: [],
      };

      console.log(this.subscribers)
      return this;
    }
  }

  addSubscriber(channel, callback) {
    const selectSubscribers = this.subscribers[channel]
    selectSubscribers.push(callback);
    return this
  }


  notifySubscribers(channel) {
    const selectSubscribers = this.subscribers[channel];
    selectSubscribers.forEach((fn) => fn())
    return this
  }

  //setSender
  setSender(sender) {
    this.sender = sender
  }

  //addChannel
  addChannel(name, newsUrls) {
    this.channels = {
      ...this.channels,
      [name]: newsUrls,
    };
    return this;
  }
}

class NotificationSingle {
  constructor(data, id) {
    this.data = data;
    this.id = id;
    this.sender = '';
    this.created_at = Date.now();
    this.read = false;
  }
}

const exampleNotification = new NotificationSingle(
  { body: { title: 'notifica', message: 'ciao' } },

);

const exampleNotification2 = new NotificationSingle({
  body: { title: 'notifica2', message: 'Arrivederci' },
});

const notificationCenter = new NotificationCenter();

notificationCenter.addChannel('channel1', {
  fetchUrl: ' http://localhost:8000/general',
  readUrl: 'http://localhost:8000/general',
  createUrl: 'http://localhost:8000/general',
});

notificationCenter.addChannel('channel2', {
  fetchUrl: ' http://localhost:8000/prova',
  readUrl: 'http://localhost:8000/prova',
  createUrl: 'http://localhost:8000/prova',
});

notificationCenter.get('channel1');

const pulsante = document.querySelector('#uno');
const pulsante2 = document.querySelector('#due');
const pulsante3 = document.querySelector('#tre');
const pulsante4 = document.querySelector('#quattro');
pulsante.addEventListener('click', e => {
  e.preventDefault();
  notificationCenter.push(exampleNotification, 'channel1');
});

pulsante2.addEventListener('click', e => {
  e.preventDefault();
  console.log(notificationCenter.notifications);
});
pulsante3.addEventListener('click', e => {
  e.preventDefault();
  notificationCenter.read('channel1', 46);
});
pulsante4.addEventListener('click', e => {
  console.log(notificationCenter.notifications);
  notificationCenter.get('channel1');
});

//sub
const observer1 = () => {
  console.log('Callback di prova 1');
};
const observer2 = () => {
  console.log('Callback di prova 2');
};

notificationCenter.createSubscribe('channel1');
notificationCenter.createSubscribe('chadjndhjnsnnel1');
notificationCenter.addSubscriber('channel1', observer1);
notificationCenter.addSubscriber('channel1', observer2);



