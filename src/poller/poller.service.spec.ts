import { Test, TestingModule } from '@nestjs/testing';
import { PollerService } from './poller.service';

describe('PollerService', () => {
  let service: PollerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PollerService],
    }).compile();

    service = module.get<PollerService>(PollerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
