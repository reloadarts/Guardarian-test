import { Controller, Get, Param } from '@nestjs/common';
import { EstimateService } from './estimate.service';

@Controller('estimate')
export class EstimateController {
  constructor(private readonly estimateService: EstimateService) {}

  @Get(':currency')
  getCurrency(@Param('currency') currency: string): Promise<number> {
    return this.estimateService.getCurrency(currency);
  }
}
