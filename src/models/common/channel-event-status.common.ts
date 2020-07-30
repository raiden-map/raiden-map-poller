export abstract class ChannelEventsStatus {
    blockTimestamp?: number;
    block?: number;
}
export class ChannelOpenedStatus extends ChannelEventsStatus {
    opened_channels_sum?: number;
    opened_channel_identifiers?: number[];
}

export class ChannelClosedStatus extends ChannelEventsStatus {
    closed_channels_sum?: number;
    closed_channel_identifiers?: number[];
}