import { Exclude, Expose } from 'class-transformer';
import { EventMetadata } from '../abstract/event-metadata.abstract';

class Result {
    @Expose() channel_identifier: number;
    @Expose() participant1: string;
    @Expose() participant2: string;
    @Expose() settle_timeout: number;
}

@Exclude()
export class ChannelOpenedDto extends EventMetadata {
    @Expose()
    returnValues: Result;
}

