import ScreenCapturePickerView from './ScreenCapturePickerView';
import RTCPeerConnection from './RTCPeerConnection';
import RTCIceCandidate from './RTCIceCandidate';
import RTCSessionDescription from './RTCSessionDescription';
import RTCView from './RTCView';
import MediaStream from './MediaStream';
import MediaStreamTrack from './MediaStreamTrack';
import mediaDevices from './MediaDevices';
import permissions from './Permissions';

export {
    ScreenCapturePickerView,
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    permissions,
    registerGlobals
};

// React Native has a global object which acts like `window` in the browser.
declare const global: {
    navigator: {
        mediaDevices: {
            getUserMedia: (constraints: unknown) => Promise<MediaStream>,
            getDisplayMedia: (constraints: unknown) => Promise<MediaStream>,
            enumerateDevices: () => Promise<unknown>,
        }
    }
    RTCPeerConnection: typeof RTCPeerConnection,
    RTCIceCandidate: typeof RTCIceCandidate,
    RTCSessionDescription: typeof RTCSessionDescription,
    MediaStream: typeof MediaStream,
    MediaStreamTrack: typeof MediaStreamTrack
};

function registerGlobals(): void {
    // Should not happen. React Native has a global navigator object.
    if (typeof global.navigator !== 'object') {
        throw new Error('navigator is not an object');
    }

    if (!global.navigator.mediaDevices) {
        global.navigator.mediaDevices = {
            getUserMedia: mediaDevices.getUserMedia.bind(mediaDevices),
            getDisplayMedia: mediaDevices.getDisplayMedia.bind(mediaDevices),
            enumerateDevices: mediaDevices.enumerateDevices.bind(mediaDevices)
        };
    }

    global.RTCPeerConnection = RTCPeerConnection;
    global.RTCIceCandidate = RTCIceCandidate;
    global.RTCSessionDescription = RTCSessionDescription;
    global.MediaStream = MediaStream;
    global.MediaStreamTrack = MediaStreamTrack;
}
