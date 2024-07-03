import { NestFactory } from '@nestjs/core';
import { EpicRidesBatchModule } from './epic-rides_batch.module';

async function bootstrap() {
  const app = await NestFactory.create(EpicRidesBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
