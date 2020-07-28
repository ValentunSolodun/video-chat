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

  cancelCall() {
    this.S.emit('cancel-call');
  }

  cancelledCall(callback) {
    this.S.on('cancelled-call', () => callback())
  }

  clientHasOngoingCall(callback) {
    this.S.on('client-has-ongoing-call', () => callback())
  }

  clientsConnected(callback) {
    this.S.on('clients-connected', () => callback())
  }

  getOnlineUsers(callback) {
    this.S.on('get-online-users', users => callback(users))
  }

  endCall() {
    this.S.emit('end-call')
  }

  disconnected(callback) {
    this.S.on('disconnected', () => callback())
  }
}

export {InitializeChat};
