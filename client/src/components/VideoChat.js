import React from 'react';
import {OTPublisher, OTSubscriber, createSession} from 'opentok-react';
import _ from 'lodash';

class VideoChat extends React.Component {

  state = {
    streams: [],
    createdSession: false,
  }

  componentDidMount() {
    this.sessionHelper = createSession({
      apiKey: this.props.apiKey,
      sessionId: this.props.sessionId,
      token: this.props.token,
      onStreamsUpdated: streams => {
        this.setState({streams});
      }
    });
    this.setState({createdSession: true})
  }

  render() {
    return (
      <>
        <div>
          {/*<button id="videoButton" onClick={this.toggleVideo}>*/}
          {/*  {publishVideo ? 'Disable' : 'Enable'} Video*/}
          {/*</button>*/}
          {
            this.state.createdSession ? (
              <OTPublisher
                session={this.sessionHelper.session}
                properties={{publishVideo: true, width: 50, height: 50,}}
                // onPublish={this.onPublish}
                // onError={this.onPublishError}
                // eventHandlers={this.publisherEventHandlers}
              />
            ) : null
          }
          {
            !_.isEmpty(this.state.streams) ? (
              this.state.streams.map(stream => {
                return (
                  <OTSubscriber
                    key={stream.id}
                    session={this.sessionHelper.session}
                    stream={stream}
                  />
                );
              })
            ) : 'Loading for client'
          }
        </div>
      </>
    )
  }
}

export default VideoChat;
