import { Sensor, SensorChangeEvent } from '../sensors/sensor';
import { r } from '../connection';

export class HistoryService {
  r: any;

  constructor() {
    this.r = r;
  }

  list(start: Date, end: Date): Promise<SensorChangeEvent[]> {
    return this.r.table('sensor_history')
      .between(start, end, {index: 'lastUpdated'})
      .orderBy(this.r.desc('lastUpdated'))
      .run();
  }
}