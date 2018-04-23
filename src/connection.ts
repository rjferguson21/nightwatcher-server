import { config } from './config';
import rethinkdbdash from 'rethinkdbdash';
import rethinkdbInit from 'rethinkdb-init';

export const r = rethinkdbdash(config.rethinkdb);

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