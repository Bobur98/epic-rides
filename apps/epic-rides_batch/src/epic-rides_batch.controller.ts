import { Controller, Get } from '@nestjs/common';
import { EpicRidesBatchService } from './epic-rides_batch.service';

@Controller()
export class EpicRidesBatchController {
  constructor(private readonly epicRidesBatchService: EpicRidesBatchService) {}

  @Get()
  getHello(): string {
    return this.epicRidesBatchService.getHello();
  }
}
