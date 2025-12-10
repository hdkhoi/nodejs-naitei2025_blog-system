import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { IApiResponse } from '../interfaces/IApiResponse';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status: number;
    let message: string;
    let error: any;

    if (exception instanceof HttpException) {
      // lỗi có chủ đích (biết trước - lỗi http)
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      switch (typeof exceptionResponse) {
        case 'string':
          message = exceptionResponse;
          break;
        case 'object':
          const exceptionResponseObj = exceptionResponse as Record<string, any>;
          message =
            exceptionResponseObj.message ||
            exceptionResponseObj.error ||
            'Error occurred';

          if (exceptionResponseObj.error) {
            error = exceptionResponseObj.error;
          }

          // lỗi validate DTO
          if (Array.isArray(exceptionResponseObj.message)) {
            message = 'Validation failed';
            error = exceptionResponseObj.message;
          }
          break;
      }
    } else {
      // lỗi không có chủ đích (không biết trước - lỗi hệ thống)
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      message = 'Internal Server Error';
      this.logger.error(exception);
    }

    const errorResponse: IApiResponse<any> = {
      success: false,
      message,
      ...(error && { error }),
    };
    response.status(status).json(errorResponse);
  }
}