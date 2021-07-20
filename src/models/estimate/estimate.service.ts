import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fetch from 'node-fetch';

@Injectable()
export class EstimateService {
  constructor(private configService: ConfigService) {}

  async getCurrency(currency: string): Promise<number> {
    const apiUrl = this.configService.get('API_PATH');
    const apiKey = this.configService.get('API_KEY');

    if (!apiKey || !apiUrl) {
      throw new Error('apiUrl or apiKey is invalid');
    }

    const headers = {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    };

    const requestOptions = {
      method: 'GET',
      headers,
    };

    const res = await fetch(
      `${apiUrl}?from_currency=${currency}&to_currency=EUR&from_amount=1`,
      requestOptions,
    ).catch(() => {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Error',
        },
        HttpStatus.BAD_REQUEST,
      );
    });

    if (!res.ok) {
      const error = await res.json();
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: error.message || 'Error',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const data = await res.json();
    return data.value;
  }
}
