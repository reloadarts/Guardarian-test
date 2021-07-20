import {
  Catch,
  LoggerService,
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) {}

  public catch(exception, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message: string =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const details = exception.response
      ? exception.response.error
      : 'Something went wrong';

    const data = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      details,
      message,
    };

    this.logger.error({
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
      user: request.user,
      headers: request.headers,
      body: request.body,
      query: request.query,
      params: request.params,
      exception,
      data,
    });

    response.type('application/json').status(status).send(data);
  }
}
