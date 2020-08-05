import { Schema, Prop, SchemaFactory } from "@nestjs/mongoose";
import { ChannelOpenedStatus, ChannelClosedStatus } from "./common/channel-event-status.common";
import { Document } from 'mongoose';

@Schema()
export class ChannelTimelineOverview extends Document{
    @Prop()
    tokenNetwork: string;
    @Prop()
    channelOpened: ChannelOpenedStatus[];
    @Prop()
    channelClosed: ChannelClosedStatus[];
}

export const ChannelTimelineOverviewSchema = SchemaFactory.createForClass(ChannelTimelineOverview);
