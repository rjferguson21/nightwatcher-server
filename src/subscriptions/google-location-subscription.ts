import { MqttSubscription } from './subscription';

export default class GoogleLocationSubscription implements MqttSubscription {
  topic: string;

  constructor() {
    this.topic = 'google/location/#';
  }

  handle(topic: string, message: string) {
    console.log('google', topic, message);
  }
}

