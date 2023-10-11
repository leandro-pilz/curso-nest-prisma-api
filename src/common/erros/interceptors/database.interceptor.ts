import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { isPrismaErrorUtil } from '../utils/is-prisma-error-util';
import { handeDataBaseErrors } from '../utils/handle-datbase-error-util';
import { DataBaseError } from '../types/DataBaseError';

@Injectable()
export class DataBaseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    return next.handle().pipe(
      catchError(err => {
        if (isPrismaErrorUtil(err)) {
          err = handeDataBaseErrors(err);
        }
        if (err instanceof DataBaseError) {
          throw new BadRequestException(err.message);
        }

        throw err;
      }),
    );
  }
}
