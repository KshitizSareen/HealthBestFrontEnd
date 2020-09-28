import AsyncStorage from "@react-native-community/async-storage";
import React, { Component } from "react";
import firebase from 'react-native-firebase';
export default class NotificationService extends Component {
  constructor(props) {
    super(props);
}

componentDidMount() {
    // setting channel for notification
    const channel = new firebase.notifications.Android.Channel(
        'channelId',
        'Channel Name',
        firebase.notifications.Android.Importance.Max
    ).setDescription('A natural description of the channel');
    firebase.notifications().android.createChannel(channel);
    
    // showing notification when app is in foreground.
    this.foregroundStateListener = firebase.notifications().onNotification((notification) => {
       
      firebase.notifications().displayNotification(notification).catch(err => console.error(err));
    });
    
    // app tapped/opened in killed state
    this.appKilledStateListener = firebase.notifications().getInitialNotification()
    .then((notificationOpen: NotificationOpen) => {
        if (notificationOpen) {
            // anything you want to do with notification object.....
        }
    });
    
    // app tapped/opened in foreground and background state
    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen: NotificationOpen) => {
        // ...anything you want to do with notification object.....
    });
}
componentWillUnmount() {
    this.appKilledStateListener();
    this.notificationOpenedListener();
    this.foregroundStateListener();
}

// firebase token for the use

render() {
    return null;
}
}
