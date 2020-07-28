import { Exclude, Expose } from 'class-transformer';
import { EventMetadata } from '../abstract/event-metadata.abstract';

class Result {
    @Expose() channel_identifier: number;
    @Expose() closing_participant: string;
    @Expose() nonce: number;
    @Expose() balance_hash: string;
}

@Exclude()
export class NonClosingBalanceProofUpdatedDto extends EventMetadata {
    @Expose()
    returnValues: Result;
}

