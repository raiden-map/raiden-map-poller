import { Exclude, Expose } from 'class-transformer';
import { EventMetadata } from '../abstract/event-metadata.abstract';

class Result {
    @Expose() channel_identifier: number;
    @Expose() participant: string;
    @Expose() total_withdraw: number;
}

@Exclude()
export class ChannelWithdrawDto extends EventMetadata {
    @Expose()
    returnValues: Result;
}

