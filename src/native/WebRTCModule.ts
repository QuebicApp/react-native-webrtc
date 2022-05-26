import { NativeModule, NativeModules } from 'react-native';
const { WebRTCModule } = NativeModules;

interface Constraints {
    audio?: boolean | AudioConstraints;
    video?: boolean | VideoConstraints;
}

interface AudioConstraints {
    mandatory: unknown;
    optional: unknown;
}

interface VideoConstraints {
    deviceId: string;
    width: number;
    height: number;
    frameRate: number;
    facingMode: "environment" | "user";
}

type PermissionType = "camera" | "microphone";
type PermissionResult = "denied" | "granted" | "prompt";

interface SessionDescription {
    readonly sdp: string;
    readonly type: string;
}

interface GenericDevice {
    kind: string;
    label: string;
    deviceId: string;
    groupId: string;
}

interface AudioDevice extends GenericDevice {
    kind: "audioinput";
}

interface VideoDevice extends GenericDevice {
    kind: "videoinput";
    facing: "front" | "environment" | "unknown";
}

type InputDevice = AudioDevice | VideoDevice;

type DataChannelReadyState = "open" | "closed" | "closing" | "connecting" | null;

interface DataChannelInfo {
    id: number;
    label: string;
    reactTag: string;
    peerConnectionId: number;
    maxPacketLifeTime: number;
    maxRetransmits: number;
    negotiated: boolean;
    ordered: boolean;
    protocol: string;
    readyState: DataChannelReadyState;
}

interface DisplayMedia {
    streamId: string;
    track: TrackInfo;
}

interface TrackInfo {
    enabled: boolean;
    id: string;
    kind: "audio" | "video"
    label: string;

    /**
     * Lowercase on Android
     * Title case on iOS
     * Note: Sometimes this is all uppercase on android (via getDisplayMedia)
     */
    readystate: "live" | "ended" | "Live" | "Ended";
    remote: boolean;

    /**
     * Only present on video tracks on Android
     * Seems to match the contraints when received via getUserMedia()
     */
    settings?: {
        width: number;
        height: number;
        frameRate: number;
    };
}

interface DataChannelConfiguration {
    id?: number;
    ordered?: boolean;

    /**
     * Only used on Android
     */
    maxRetransmitTime?: number;

    maxRetransmits?: number;

    /**
     * iOS: integer
     * Android: boolean
     */
    negotiated?: number | boolean;

    protocol?: string;
}

interface RTCIceServer {
    credential?: string;
    url?: string;
    urls?: string | string[];
    username?: string;
}

type RTCIceTransportPolicy = "all" | "relay" | "nohost" | "none";
type RTCBundlePolicy = "balanced" | "max-compat" | "max-bundle";
type RTCRtcpMuxPolicy = "require" | "negotiate";

interface RTCConfiguration {
    iceServers: RTCIceServer[],
    iceTransportPolicy: RTCIceTransportPolicy;
    bundlePolicy: RTCBundlePolicy;
    rtcpMuxPolicy: RTCRtcpMuxPolicy;

    //#region Private API
    tcpCandidatePolicy: "enabled" | "disabled";
    audioJitterBufferMaxPackets: number;
    iceConnectionReceivingTimeout: number;
    iceBackupCandidatePairPingInterval: number;

    //#region Android specific
    iceCandidatePoolSize: unknown;
    candidateNetworkPolicy: unknown;
    keyType: unknown;
    continualGatheringPolicy: unknown;
    audioJitterBufferFastAccelerate: unknown;
    pruneTurnPorts: unknown;
    presumeWritableWhenFullyRelayed: unknown;
    //#endregion
    //#endregion
}

/**
 * @See {RTCIceCandidateInit} in lib.dom.d.ts
 */
interface IceCandidateInit {
    sdpMid: string;
    sdpMLineIndex: number;
    candidate: string;
}

type RTCSdpType = "answer" | "offer" | "pranswer" | "rollback";

interface RTCLocalSessionDescriptionInit {
    sdp?: string;
    /**
     * Should be optional, is reversed with the `type` prop for
     * setRemoteDescription() on Android.
     */
    type: RTCSdpType;
}

interface RTCSessionDescriptionInit {
    sdp?: string;
    /**
     * Should be required, is reversed with the `type` prop for
     * setRemoteDescription() on Android.
     */
    type?: RTCSdpType;
}

interface WebRTCModule extends NativeModule {
    getDisplayMedia(): Promise<DisplayMedia>;
    getUserMedia(constraints: Constraints, success: (id: string, tracks: TrackInfo[]) => void, failure: (type: any, message: any) => void): void;

    enumerateDevices(resolve: (value: InputDevice[]) => void): void;

    peerConnectionInit(configuration: any, _peerConnectionId: number): void;
    peerConnectionAddStream(reactTag: string, peerConnectionId: number): void;
    peerConnectionRemoveStream(reactTag: string, peerConnectionId: number): void;
    peerConnectionCreateOffer(peerConnectionId: number, options: unknown, callback: (successful: boolean, data: SessionDescription | Error) => void): void;
    peerConnectionCreateAnswer(peerConnectionId: number, options: unknown, callback: (successful: boolean, data: SessionDescription | Error) => void): void;
    peerConnectionSetConfiguration(configuration: RTCConfiguration, peerConnectionId: number): void;
    peerConnectionSetLocalDescription(peerConnectionId: number, desc: RTCLocalSessionDescriptionInit | null): Promise<SessionDescription>;
    peerConnectionSetRemoteDescription(sdpMap: RTCSessionDescriptionInit, peerConnectionId: number, callback: (successful: boolean, data: SessionDescription) => void): void;
    peerConnectionAddICECandidate(peerConnectionId: number, candidateMap: IceCandidateInit): Promise<SessionDescription>;
    peerConnectionGetStats(peerConnectionId: number): Promise<any>;
    peerConnectionClose(peerConnectionId: number): void;
    peerConnectionRestartIce(peerConnectionId: number): void;

    createDataChannel(peerConnectionId: number, label: string, dataChannelDict: DataChannelConfiguration | undefined): DataChannelInfo;
    dataChannelSend(peerConnectionId: number, reactTag: string, data: string, type: "binary" | "text"): void;
    dataChannelClose(peerConnectionId: number, reactTag: string): void;
    dataChannelDispose(peerConnectionId: number, reactTag: string): void;

    checkPermission(name: PermissionType): PermissionResult;
    requestPermission(name: PermissionType): PermissionResult;

    mediaStreamTrackSetEnabled(trackId: string, enabled: boolean): void;
    mediaStreamTrackSwitchCamera(trackId: string): void;
    mediaStreamTrackRelease(trackId: string): void;

    mediaStreamAddTrack(streamId: string, trackId: string): void;
    mediaStreamRemoveTrack(streamId: string, trackId: string): void;
    mediaStreamRelease(streamId: string): void;
    mediaStreamCreate(streamId: string): void;
}

export default WebRTCModule as WebRTCModule;
