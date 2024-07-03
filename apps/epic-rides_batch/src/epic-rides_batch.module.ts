import { Module } from '@nestjs/common';
import { EpicRidesBatchController } from './epic-rides_batch.controller';
import { EpicRidesBatchService } from './epic-rides_batch.service';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [EpicRidesBatchController],
  providers: [EpicRidesBatchService],
})
export class EpicRidesBatchModule {}
