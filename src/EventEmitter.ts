import { NativeEventEmitter } from 'react-native';

import WebRTCModule from './native/WebRTCModule';

const EventEmitter = new NativeEventEmitter(WebRTCModule);

export default EventEmitter;
