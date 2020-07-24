import { Test, TestingModule } from '@nestjs/testing';
import { TokenNetworkService } from './token-network.service';

describe('TokenNetworkService', () => {
  let service: TokenNetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenNetworkService],
    }).compile();

    service = module.get<TokenNetworkService>(TokenNetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
