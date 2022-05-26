import { NativeModule, NativeModules } from 'react-native';

const { WebRTCModule } = NativeModules as {
    WebRTCModule: WebRTCModule
};

type WebRTCModule = any;

export default WebRTCModule;
