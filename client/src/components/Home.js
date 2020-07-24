import React from 'react';
import {OTSession, OTPublisher, OTStreams, OTSubscriber, createSession} from 'opentok-react';
import {getCreatedSession} from '../lib/api';
import {InitializeChat} from '../lib/videoChat';
import {
  API_KEY,
  SESSION_ID,
  TOKEN
} from '../config';
import _ from 'lodash';
import VideoChat from './VideoChat';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      onlineUsers: [],
      error: null,
      apiKey: API_KEY,
      sessionId: SESSION_ID,
      token: TOKEN,
      streams: [],
      connected: false,
      publishVideo: true,
    };

    this.sessionEventHandlers = {
      sessionConnected: () => {
        this.setState({connection: 'Connected'});
      },
      sessionDisconnected: () => {
        this.setState({connection: 'Disconnected'});
      },
      sessionReconnected: () => {
        this.setState({connection: 'Reconnected'});
      },
      sessionReconnecting: () => {
        this.setState({connection: 'Reconnecting'});
      },
    };

    this.publisherEventHandlers = {
      accessDenied: () => {
        console.log('User denied access to media source');
      },
      streamCreated: () => {
        console.log('Publisher stream created');
      },
      streamDestroyed: ({reason}) => {
        console.log(`Publisher stream destroyed because: ${reason}`);
      },
    };

    this.subscriberEventHandlers = {
      videoEnabled: () => {
        console.log('Subscriber video enabled');
      },
      videoDisabled: () => {
        console.log('Subscriber video disabled');
      },
    };
  }

  createSession = () => {
    getCreatedSession().then(data => {
      this.setState({
        apiKey: data.apiKey,
        sessionId: data.sessionId,
        token: data.token,
      })
    });
  }

  deleteSession = () => {
    this.setState({sessionId: ''})
    // deleteSession().then(data => {
    //   this.setState({
    //     apiKey: data.apiKey,
    //     sessionId: data.sessionId,
    //     token: data.token,
    //   })
    // });
  }

  componentDidMount() {
    this.chat = new InitializeChat('http://localhost:3001').connect();
    this.chat.setOnline();
    this.chat.getOnlineUsers((onlineUsers) => this.setState({onlineUsers}));
    this.chat.createdSession((dataForSession) => this.setState({
      calling: true,
      ...dataForSession
    }));
    this.chat.incomingCall((dataForSession) => this.setState({
      incomingCall: true,
      ...dataForSession
    }));
    // this.sessionHelper = createSession({
    //   apiKey: API_KEY,
    //   sessionId: SESSION_ID,
    //   token: TOKEN,
    //   onStreamsUpdated: streams => {
    //     this.setState({streams});
    //   }
    // });
    // this.setState({
    //   connected: true
    // })
  }


  onSessionError = error => {
    this.setState({error});
  };

  onPublish = () => {
    console.log('Publish Success');
  };

  onPublishError = error => {
    this.setState({error});
  };

  onSubscribe = () => {
    console.log('Subscribe Success');
  };

  onSubscribeError = error => {
    this.setState({error});
  };

  toggleVideo = () => {
    this.setState(state => ({
      publishVideo: !state.publishVideo,
    }));
  };

  render() {
    const {error, connecting, connected, session, publishVideo} = this.state;
    console.log(this.state);
    const filteredUsers = _.filter(this.state.onlineUsers, u => u.userId !== JSON.parse(localStorage.getItem('user')).id)
    return (
      <div>
        Online users:
        <ul>
          {
            _.map(filteredUsers, u => {
              return <li>{u.userName}
                <button onClick={() => this.chat.startCall(u.userId)}>Call</button>
              </li>
            })
          }
        </ul>
        {
          this.state.calling ?
            <VideoChat apiKey={this.state.apiKey} sessionId={this.state.sessionId} token={this.state.token}/>
            :
            null
        }
        {
          this.state.incomingCall ? (
            <div>
              <span>Calling from {this.state.userName}</span>
              <button onClick={() => this.setState({incomingCall: false, calling: true})}>Pick up</button>
              <button>Hang up</button>
            </div>
          ) : null
        }

        {/*<div>*/}
        {/*  <div>Your session id: {this.state.sessionId}</div>*/}
        {/*  <label>*/}
        {/*    Online*/}
        {/*    <input onClick={this.createSession} id='online' name='network' type="radio"/>*/}
        {/*  </label>*/}
        {/*  <label>*/}
        {/*    Offline*/}
        {/*    <input onClick={this.deleteSession} id='offline' name='network' type="radio"/>*/}
        {/*  </label>*/}
        {/*</div>*/}

      </div>
    )
  }
}

