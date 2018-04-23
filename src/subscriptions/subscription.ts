import { MqttSubscriptionOptions } from './subscription';
import { config } from '../config';
import { includes, map } from 'lodash';
import * as mqtt from 'mqtt';
import { Sensor } from '../sensors/sensor';
import winston from 'winston';

winston.level = 'debug';

export type MqttSubscriptionOptions = {
  server?: any;
}

export declare class MqttSubscription {
  constructor(options?: MqttSubscriptionOptions);
  topic: string;
  handle(topic: string, message: string): void;
};

export class MqttSubscriptions {
  client: any;
  constructor() {}

  mqttMatch(filter: string, topic: string): boolean {
      const filterArray = filter.split('/')
      const length = filterArray.length
      const topicArray = topic.split('/')
    
      for (var i = 0; i < length; ++i) {
        var left = filterArray[i]
        var right = topicArray[i]
        if (left === '#') return true
        if (left !== '+' && left !== right) return false
      }
    
      return length === topicArray.length
  }
  connect(options: MqttSubscriptionOptions) {
    Promise.all(
      config.mqttSubscriptions.map((path) => {
        return import(`./${path}.ts`).then(module => new module.default(options)) as Promise<MqttSubscription>;
      })
    ).then((subscriptions: MqttSubscription[]) => {
      const topics = map(subscriptions, 'topic');
      winston.debug(`Subscribing to topcs: ${topics}`);
      
      this.client = mqtt.connect(config.mqtt);

      this.client.on('connect', () => {
        winston.info(`Connected to MQTT`);
        this.client.subscribe(topics);
      });
  
      this.client.on('message', (topic: string, message: string) => {
        winston.debug(`Received message over MQTT: Topic: ${topic}, Message: ${message}`);

        subscriptions.filter((subscription: MqttSubscription) => {
          return this.mqttMatch(subscription.topic, topic);
        }).forEach((subscription: MqttSubscription) => {
          subscription.handle(topic, message);
        }); 
      });
      
    }).catch((err) => {
      winston.error(err);
      return Promise.reject(err);
    });
  }
}

