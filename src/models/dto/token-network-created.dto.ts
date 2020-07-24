import { Document } from 'mongoose';
import { EventMetadata } from '../abstract/event-metadata.abstract';
import { Expose, Transform, Exclude, plainToClass } from 'class-transformer';
class Result{
    @Expose()
    token_address: string;
    @Expose()
    token_network_address: string;
}

@Exclude()
export class TokenNetworkCreatedDto extends EventMetadata {
    @Expose()
    returnValues: Result;
}

