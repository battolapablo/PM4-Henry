import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DateAdderInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> {
    const now = new Date();
    const formattedDate = now.toLocaleString();

    return next.handle().pipe(
      map((data) => {
        if (Array.isArray(data)) {
          return [...data, { createdAt: formattedDate }];
        } else if (typeof data === 'object' && data !== null) {
          return { ...data, createdAt: formattedDate };
        } else {
          throw new BadRequestException(
            'Unexpected data type in DateAdderInterceptor',
          );
        }
      }),
    );
  }
}
