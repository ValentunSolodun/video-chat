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

  setOnline(userId) {
    this.S.emit('set-online', userId);
  }

  setOffline(userId) {
    this.S.emit('set-offline', userId)
  }

  startCall(userId) {
    this.S.emit('start-call', userId)
  }

  incomingCall(callback) {
    this.S.on('incoming-call', dataForSession => {
      callback(dataForSession)
    });
  }

  createdSession(callback) {
    this.S.on('created-session', dataForSession => callback(dataForSession))
  }

  getOnlineUsers(callback) {
    this.S.on('get-online-users', users => callback(users))
  }

  disconnect() {
    this.S.close();
  }
}

export {InitializeChat};
