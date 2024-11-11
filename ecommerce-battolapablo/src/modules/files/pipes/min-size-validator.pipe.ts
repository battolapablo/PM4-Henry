import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class MinSizeValidatorPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const minSize = 1000000;
    if (value.length > minSize) {
      throw new BadRequestException(
        `El tamaño del archivo debe ser de al menos ${minSize} bytes.`,
      );
    }
    return value;
  }
}
