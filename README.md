# 📦 Notification Library

A notification library that allows you to manage channels and their notifications with JSON server

### How it works

With this library it is possible to create channels and insert in them the relative notifications, get them from the remote server and read them.

---

#### Different functions

###### addChannel()

```
notificationCenter.addChannel(channelName, url)
```

###### getAllNotifications()

```
notificationCenter.getAllNotifications(channelName)
```

###### pushNotification()

```
notificationCenter.pushNotification(notification, channelName)
```

###### readNotification()

```
notificationCenter.readNotification(channelName, id)
```

###### setSender()

```
notificationCenter.setSender(sender)
```
