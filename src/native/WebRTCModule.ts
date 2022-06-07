import { NativeModule, NativeModules } from 'react-native';

const { WebRTCModule } = NativeModules as {
    WebRTCModule: WebRTCModule
};

export interface Constraints {
    audio?: boolean | AudioConstraints;
    video?: boolean | VideoConstraints;
}

export interface AudioConstraints {
    mandatory: unknown;
    optional: unknown;
}

export interface VideoConstraints {
    deviceId: string;
    width: number;
    height: number;
    frameRate: number;
    facingMode: "environment" | "user";
}

export type PermissionType = "camera" | "microphone";
export type PermissionResult = "denied" | "granted" | "prompt";

export interface SessionDescription {
    readonly sdp: string;
    readonly type: RTCSdpType;
}

export interface GenericDevice {
    kind: string;
    label: string;
    deviceId: string;
    groupId: string;
}

export interface AudioDevice extends GenericDevice {
    kind: "audioinput";
}

export interface VideoDevice extends GenericDevice {
    kind: "videoinput";
    facing: "front" | "environment" | "unknown";
}

export type InputDevice = AudioDevice | VideoDevice;

export type DataChannelReadyState = "open" | "closed" | "closing" | "connecting" | null;

export interface DataChannelInfo {
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

export interface DisplayMedia {
    streamId: string;
    track: TrackInfo;
}

export interface TrackInfo {
    enabled: boolean;
    id: string;
    kind: "audio" | "video"
    label: string;
    readyState: "live" | "ended";
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

export interface DataChannelConfiguration {
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

export interface RTCIceServer {
    credential?: string;
    url?: string;
    urls?: string | string[];
    username?: string;
}

export type RTCIceTransportPolicy = "all" | "relay" | "nohost" | "none";
export type RTCBundlePolicy = "balanced" | "max-compat" | "max-bundle";
export type RTCRtcpMuxPolicy = "require" | "negotiate";

export interface RTCConfiguration {
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
export interface IceCandidateInit {
    sdpMid: string;
    sdpMLineIndex: number;
    candidate: string;
}

export type RTCSdpType = "answer" | "offer" | "pranswer" | "rollback";

export interface RTCLocalSessionDescriptionInit {
    sdp?: string;
    /**
     * Should be optional, is reversed with the `type` prop for
     * setRemoteDescription() on Android.
     */
    type: RTCSdpType;
}

export interface RTCSessionDescriptionInit {
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

    //#region iOS Only
    checkPermission(name: PermissionType): Promise<PermissionResult>;
    requestPermission(name: PermissionType): Promise<boolean>;
    //#endregion

    mediaStreamTrackSetEnabled(trackId: string, enabled: boolean): void;
    mediaStreamTrackSwitchCamera(trackId: string): void;
    mediaStreamTrackRelease(trackId: string): void;

    mediaStreamAddTrack(streamId: string, trackId: string): void;
    mediaStreamRemoveTrack(streamId: string, trackId: string): void;
    mediaStreamRelease(streamId: string): void;
    mediaStreamCreate(streamId: string): void;
}

export default WebRTCModule;
