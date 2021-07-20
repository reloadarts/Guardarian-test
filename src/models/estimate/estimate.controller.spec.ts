import { Test, TestingModule } from '@nestjs/testing';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';
import { ConfigService } from '@nestjs/config';

describe('EstimateController', () => {
  let controller: EstimateController;
  let service: EstimateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EstimateController],
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

    const configService = new ConfigService();
    service = new EstimateService(configService);

    controller = module.get<EstimateController>(EstimateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return currency', () => {
    const result = 1200;
    jest
      .spyOn(service, 'getCurrency')
      .mockImplementation(() => Promise.resolve(result));
    expect(controller.getCurrency('ETH')).toBeDefined();
  });
});
