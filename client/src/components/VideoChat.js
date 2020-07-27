import React from 'react';
import {OTPublisher, OTSubscriber, createSession} from 'opentok-react';
import _ from 'lodash';

const ControlButtonsPublisher = ({publishVideo, publishMicro, toggleVideo, toggleMicro}) => {
  return (
    <div>
      <button id="videoButton" onClick={toggleVideo}>
        {publishVideo ? 'Disable' : 'Enable'} Video
      </button>

      <button id="audioButton" onClick={toggleMicro}>
        {publishMicro ? 'Disable' : 'Enable'} Micro
      </button>
    </div>
  )
}

const ControlButtonsSubscriber = ({publishAudio, toggleAudio}) => {
  return (
    <div>
      <button id="audioButton" onClick={toggleAudio}>
        {publishAudio ? 'Disable' : 'Enable'} Audio
      </button>
    </div>
  )
}

class VideoChat extends React.Component {

  state = {
    streams: [],
    createdSession: false,
    publishVideo: true,
    publishMicro: true,
    publishAudioSubscriber: true,
  }

  constructor(props) {
    super(props);
    this.OTPublisherRef = React.createRef();
    this.OTSubscriberRef = React.createRef();
  }

  publisherProperties = {
    // audioFallbackEnabled: true,
    showControls: false,
    width: 300,
    height: 300
  };

  subscriberProperties = {
    // audioFallbackEnabled: true,
    showControls: false,
    width: 300,
    height: 300
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

  toggleVideo = () => {
    if (!this.OTPublisherRef.current) return;
    const client1 = this.OTPublisherRef.current.getPublisher();
    const newValue = !this.state.publishVideo;
    client1.publishVideo(newValue)
    this.setState({
      publishVideo: newValue
    })
  }

  toggleMicro = () => {
    if (!this.OTPublisherRef.current) return;
    const client1 = this.OTPublisherRef.current.getPublisher();
    const newValue = !this.state.publishMicro;
    client1.publishAudio(newValue)
    this.setState({
      publishMicro: newValue
    })
  }

  toggleAudioSubscriber = () => {
    if (!this.OTSubscriberRef.current) return;
    const client2 = this.OTSubscriberRef.current.getSubscriber();
    const newValue = !this.state.publishAudioSubscriber;
    client2.setAudioVolume(!newValue ? 0 : 100)
    this.setState({
      publishAudioSubscriber: newValue
    })
  }

  render() {
    return (
      <>
        <div>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            {
              this.state.createdSession ? (
                <div>
                  <OTPublisher
                    propertie
                    ref={this.OTPublisherRef}
                    session={this.sessionHelper.session}
                    properties={{publishVideo: this.state.publishVideo, ...this.publisherProperties}}
                    // onPublish={this.onPublish}
                    // onError={this.onPublishError}
                    // eventHandlers={this.publisherEventHandlers}
                  />
                  <ControlButtonsPublisher
                    publishMicro={this.state.publishMicro}
                    publishVideo={this.state.publishVideo}
                    toggleMicro={this.toggleMicro}
                    toggleVideo={this.toggleVideo}
                  />
                </div>
              ) : null
            }
            {
              !_.isEmpty(this.state.streams) ? (
                this.state.streams.map(stream => {
                  return (
                    <div>
                      <OTSubscriber
                        ref={this.OTSubscriberRef}
                        key={stream.id}
                        properties={this.subscriberProperties}
                        session={this.sessionHelper.session}
                        stream={stream}
                      />
                      <ControlButtonsSubscriber
                        toggleAudio={this.toggleAudioSubscriber}
                        publishAudio={this.state.publishAudioSubscriber}/>
                        <div>
                          <button onClick={this.props.onEndCall}>End call</button>
                        </div>
                    </div>

                  );
                })
              ) : 'Loading for client'
            }
          </div>
        </div>
      </>
    )
  }
}

export default VideoChat;
