import { Exclude, Expose } from 'class-transformer';
import { EventMetadata } from '../abstract/event-metadata.abstract';
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

