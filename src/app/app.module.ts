import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { EstimateModule } from '../models/estimate/estimate.module';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import * as DailyRotateFile from 'winston-daily-rotate-file';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client'),
      exclude: ['/v1*'],
    }),
    WinstonModule.forRoot({
      transports: [
        new DailyRotateFile({
          filename: 'nest_js_logs/info/pt-app-info-%DATE%.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          json: true,
          maxSize: '10m',
          maxFiles: '30d',
        }),
      ],
    }),
    EstimateModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
