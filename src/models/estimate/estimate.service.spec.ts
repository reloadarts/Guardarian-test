import { Test } from '@nestjs/testing';
import { EstimateService } from './estimate.service';
import { ConfigService } from '@nestjs/config';

describe('EstimateService', () => {
  let service: EstimateService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EstimateService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'API_PATH') {
                return process.env.API_PATH;
              }
              if (key === 'API_KEY') {
                return process.env.API_KEY;
              }
              return null;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<EstimateService>(EstimateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return currency', () => {
    service.getCurrency('ETH').then((data) => {
      expect(data).toBeDefined();
    });
  });

  it('should throw an error', () => {
    service.getCurrency('invalidcurrency').catch((err) => {
      expect(err).toBeDefined();
    });
  });
});
