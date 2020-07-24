import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { TokenInfoDto } from 'src/models/dto/token-info.dto'

@Injectable()
export class ToTokenInfoPipe implements PipeTransform {
  transform(tokenInfo: any): TokenInfoDto {
    return {
      symbol: tokenInfo.symbol,
      name: tokenInfo.name,
      homepage: tokenInfo.links.homepage[0],
      imgUrl: tokenInfo.image.large,
      twitterName: tokenInfo.links.twitter_screen_name,
      contract: tokenInfo.contract_address,
    };
  }
}
