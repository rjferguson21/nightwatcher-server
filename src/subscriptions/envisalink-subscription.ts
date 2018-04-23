import { MqttSubscription } from './subscription';
import { SensorService } from '../sensors/index';
import { config } from '../config';
import { includes } from 'lodash';
import * as mqtt from 'mqtt';
import { Sensor } from '../sensors/sensor';

export default class EnvisalinkSubscription implements MqttSubscription {
  sensors: SensorService;
  topic: string;

  constructor() {
    this.sensors = new SensorService();
    this.topic = 'envisalink/#';
  }
  
  handle(topic: string, message: string) {
    let id = topic.split('/')[1]
    let data = { 
      id, 
      status: message.toString(),
      lastUpdated: new Date()
    };

    this.sensors.update(data as Sensor);
  }
}

