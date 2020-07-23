import { Document } from 'mongoose';
import { EventMetadata } from '../abstract/event-metadata.abstract';
import { Expose, Transform, Exclude } from 'class-transformer';

@Exclude()
export class TokenNetworkCreatedDto extends EventMetadata {
    @Expose()
    returnValues: {
        token_address: string;
        token_network_address: string;
    };
}