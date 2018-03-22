import { Sensor, SensorChangeEvent } from '../sensors/sensor';

export class HistoryService {
  r: any;

  constructor(r: any) {
    this.r = r;
  }

  list(): Promise<SensorChangeEvent[]> {
    return this.r.table('sensor_history')
      .orderBy(this.r.desc('lastUpdated'))
      .limit(30)
      .run();
  }
}