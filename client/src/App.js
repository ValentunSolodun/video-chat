import React, {useState, useEffect} from 'react';
import './App.css';
import '@opentok/client';
import {Header} from './components/Header';
import {getCreatedSession} from './lib/api';
import {OTSession, OTPublisher, OTStreams, OTSubscriber, createSession} from 'opentok-react';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {streams: [], connected: false}
  }

  componentDidMount() {
    getCreatedSession().then(data => {
      this.sessionHelper = createSession({
        apiKey: data.apiKey,
        sessionId: data.sessionId,
        token: data.token,
        onStreamsUpdated: streams => this.setState({streams})
      });
      this.setState({connected: true});
    });
    // window.OT.registerScreenSharingExtension('chrome', 'baz', 2);
  }

  componentWillUnmount() {
    this.sessionHelper.disconnect();
    this.setState({connected: false});
  }

  onSessionError = err => {
    console.log(err);
  }
  onPublishError = err => {
    console.log(err);
  }
  onSubscribeError = err => {
    console.log(err);
  }

  sessionEventHandlers = (data) => {
    console.log(data);
  }

  onPublish = e => console.log(e);
  publisherEventHandlers = e => console.log(e);

  onSubscribe = e => console.log(e);
  subscriberEventHandlers = e => console.log(e);

  render() {

    console.log(this.state);
    return (
      <div className="App">
        <Header text='Video chat example'/>
        {
          this.state.connected ? (
            <OTPublisher session={this.sessionHelper.session}/>
            // <OTSession
            //   apiKey={config.apiKey}
            //   sessionId={config.sessionId}
            //   token={config.token}
            //   onError={onSessionError}
            //   eventHandlers={sessionEventHandlers}
            // >
            //   {/*<button id="videoButton" onClick={this.toggleVideo}>*/}
            //   {/*  {publishVideo ? 'Disable' : 'Enable'} Video*/}
            //   {/*</button>*/}
            //   <OTPublisher
            //     properties={{publishVideo: true, width: 400, height: 400,}}
            //     onPublish={onPublish}
            //     onError={onPublishError}
            //     eventHandlers={publisherEventHandlers}
            //   />
            //   <OTStreams>
            //       <OTSubscriber
            //         properties={{ width: 100, height: 100 }}
            //         onSubscribe={onSubscribe}
            //         onError={onSubscribeError}
            //         eventHandlers={subscriberEventHandlers}
            //         retry={true}
            //         maxRetryAttempts={3}
            //         retryAttemptTimeout={2000}
            //       />
            //   </OTStreams>
            // </OTSession>
          ) : 'Loading...'
        }
      </div>
    );
  }
}

export default App;
