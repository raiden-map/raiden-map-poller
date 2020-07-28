import { Exclude, Expose } from 'class-transformer';
import { EventMetadata } from '../abstract/event-metadata.abstract';

class Result {
    @Expose() channel_identifier: number;
    @Expose() participant1_amount: number;
    @Expose() participant1_locksroot: string;
    @Expose() participant2_amount: number;
    @Expose() participant2_locksroot: string;
}

@Exclude()
export class ChannelSettledDto extends EventMetadata {
    @Expose()
    returnValues: Result;
}

