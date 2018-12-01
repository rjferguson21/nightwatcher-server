import { config } from './config';
import rethinkdbdash from 'rethinkdbdash';
import rethinkdbInit from 'rethinkdb-init';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';

const r = rethinkdbdash(config.rethinkdb);
const mqttConn = mqtt.connect(config.mqtt);

export function initDB(): Promise<any> {
  rethinkdbInit(r);
  
  return r.init(config.rethinkdb, [
      {
        name: 'sensors'
      },
      {
        name: 'sensor_history',
        indexes: ['lastUpdated']
      }
    ]
  ).then(() => r);
}

export function getMQTTConnection(): Promise<MqttClient> {
  return new Promise((resolve, reject) => {
    if (mqttConn.connected) {
      resolve(mqttConn);
    } else {
      mqttConn.reconnect();
      mqttConn.on('connect', () => {
        resolve(mqttConn);
      })
    }
  });
}
