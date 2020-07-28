import { Exclude, Expose } from 'class-transformer';
import { EventMetadata } from '../abstract/event-metadata.abstract';

class Result {
    @Expose() channel_identifier: number;
    @Expose() participant: string;
    @Expose() total_deposit: number;
}

@Exclude()
export class ChannelNewDepositDto extends EventMetadata {
    @Expose()
    returnValues: Result;
}

