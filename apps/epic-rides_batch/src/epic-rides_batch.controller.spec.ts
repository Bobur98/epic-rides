import { Test, TestingModule } from '@nestjs/testing';
import { EpicRidesBatchController } from './epic-rides_batch.controller';
import { EpicRidesBatchService } from './epic-rides_batch.service';

describe('EpicRidesBatchController', () => {
  let epicRidesBatchController: EpicRidesBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [EpicRidesBatchController],
      providers: [EpicRidesBatchService],
    }).compile();

    epicRidesBatchController = app.get<EpicRidesBatchController>(EpicRidesBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(epicRidesBatchController.getHello()).toBe('Hello World!');
    });
  });
});
