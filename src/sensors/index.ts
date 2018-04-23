import { Sensor, SensorChangeEvent } from './sensor';
import winston from 'winston';
import { r } from '../connection';
winston.level = 'debug';

export class SensorService {
  r: any;

  constructor() {
    this.r = r;
  }

  private _toSensorChangeEvent(previousSensor: Sensor, sensor: Sensor): SensorChangeEvent {
    return {
      sensorId: sensor.id,
      lastUpdated: sensor.lastUpdated,
      toStatus: previousSensor.status,
      fromStatus: sensor.status
    }
  }

  logSensorChange(sensor: Sensor): Promise<any> {
    return this.get(sensor.id).then((previousSensor: Sensor) => {
      if (sensor.status !== previousSensor.status) {
        winston.debug(`Recording change event for node: ${previousSensor.id}, from: ${previousSensor.status}, to: ${sensor.status}`);
        return this.r.table('sensor_history')
          .insert(this._toSensorChangeEvent(previousSensor, sensor))
          .run();
      } else {
        return Promise.resolve();
      }
    });
  }

  list(): Promise<Sensor[]> {
    return this.r.table('sensors').run();
  }

  get(id: string): Promise<Sensor> {
    return this.r.table('sensors').get(id).run();
  }

  history(id: string): Promise<Sensor> {
    return this.r.table('sensor_history')
      .filter({sensorId: id})
      .orderBy(this.r.desc('lastUpdated'))
      .limit(30)
      .run();
  }

  update(sensor: Sensor) {
    this.logSensorChange(sensor);
    return this.r.table('sensors')
      .insert(sensor, { conflict: 'update' })
      .run();
  }
}