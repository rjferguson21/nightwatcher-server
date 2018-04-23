import { MqttSubscription, MqttSubscriptionOptions } from './subscription';
import winston from 'winston';

export default class WSBroadcastSubscription implements MqttSubscription {
  topic: string;
  server: any;
  
  constructor(options: MqttSubscriptionOptions) {
    this.topic = 'envisalink/#';
    this.server = options.server;
  }

  handle(topic: string, message: string) {
    winston.debug(`broadcast! ${topic} -  ${message}`);
    let id = topic.split('/')[1]
    let data = { 
      id, 
      status: message.toString(),
      lastUpdated: new Date()
    };

    this.server.broadcast(data);
  }
}

