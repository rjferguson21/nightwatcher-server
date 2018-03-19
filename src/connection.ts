import { config } from './config';
import * as rethinkdbdash from 'rethinkdbdash';
import * as rethinkdbInit from 'rethinkdb-init';

let r = rethinkdbdash(config.rethinkdb);

rethinkdbInit(r);
 
r.init(config.rethinkdb, [
    {
      name: 'sensors'
    }
  ]
);

export default r;