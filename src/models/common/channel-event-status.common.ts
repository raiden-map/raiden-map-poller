export class ChannelOpenedStatus {
    blockTimestamp: number;
    block: number;
    opened_channels_sum: number;
    opened_channel_identifiers: number[];
}

export class ChannelClosedStatus {
    blockTimestamp: number;
    block: number;
    closed_channels_sum: number;
    closed_channel_identifiers: number[];
}