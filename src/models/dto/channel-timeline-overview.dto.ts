import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ChannelOpenedStatus, ChannelClosedStatus } from "../common/channel-event-status.common";

export class ChannelTimelineOverviewDto {
    tokenNetwork: string;
    channelOpened: ChannelOpenedStatus[];
    channelClosed: ChannelClosedStatus[];
}

