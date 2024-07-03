import { Injectable } from '@nestjs/common';

@Injectable()
export class EpicRidesBatchService {
  getHello(): string {
    return 'Hello World! Batch';
  }
}
