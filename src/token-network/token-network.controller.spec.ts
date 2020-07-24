import { Test, TestingModule } from '@nestjs/testing';
import { TokenNetworkController } from './token-network.controller';

describe('TokenNetwork Controller', () => {
  let controller: TokenNetworkController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenNetworkController],
    }).compile();

    controller = module.get<TokenNetworkController>(TokenNetworkController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
