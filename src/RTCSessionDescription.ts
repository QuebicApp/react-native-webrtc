import { type RTCSdpType } from "./native/WebRTCModule";

export default class RTCSessionDescription {
    _sdp: string;
    _type: RTCSdpType;

    constructor(info: { type: RTCSdpType, sdp: string }) {
        this._sdp = info.sdp;
        this._type = info.type;
    }

    get sdp(): string {
        return this._sdp;
    }

    get type(): RTCSdpType {
        return this._type;
    }

    toJSON(): { sdp: string, type: RTCSdpType } {
        return {
            sdp: this._sdp,
            type: this._type
        };
    }
}
