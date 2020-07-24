import React from 'react';
import socketIOClient from "socket.io-client";
import {OTSession, OTPublisher, OTStreams, OTSubscriber, createSession} from 'opentok-react';

class InitializeChat {
  constructor(serverUrl) {
    this.url = serverUrl;
  }

  connect() {
    this.S = socketIOClient(this.url);
    return this;
  }

  setOnline() {
    this.S.emit('set-online', JSON.parse(localStorage.getItem('user')).id);
  }

  setOffline() {
    this.S.emit('set-offline', JSON.parse(localStorage.getItem('user')).id)
  }

  startCall(userId) {
    this.S.emit('start-call', userId)
  }

  incomingCall(callback) {
    this.S.on('incoming-call', dataForSession => {
      callback(
        this.sessionHelper = createSession({
          apiKey: dataForSession.apiKey,
          sessionId: dataForSession.sessionId,
          token: dataForSession.token,
        })
      )
    });
  }

  createdSession(callback) {
    this.S.on('get-online-users', users => callback(users))
  }

  getPublisher() {
    return <div>TEst</div>
  }


  getOnlineUsers(callback) {
    this.S.on('get-online-users', users => callback(users))
  }

  disconnect() {
    this.S.close();
  }
}

export {InitializeChat};
