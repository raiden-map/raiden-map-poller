import { Test, TestingModule } from '@nestjs/testing';
import { PollerController } from './poller.controller';

describe('Poller Controller', () => {
  let controller: PollerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PollerController],
    }).compile();

    controller = module.get<PollerController>(PollerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
