import { Sensor, SensorChangeEvent } from '../sensors/sensor';

export class HistoryService {
  r: any;

  constructor(r: any) {
    this.r = r;
  }

  list(start: Date, end: Date): Promise<SensorChangeEvent[]> {
    return this.r.table('sensor_history')
      .between(start, end, {index: 'lastUpdated'})
      .orderBy(this.r.desc('lastUpdated'))
      .run();
  }
}