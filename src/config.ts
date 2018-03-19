export type RethinkDBOptions = {
  host: string;
  port: number | string;
  db: string;
}

export type NightwatcherConfigOptions = {
  host: string;
  port: string;
  mqtt: string;
  rethinkdb: RethinkDBOptions;
}
export let config: NightwatcherConfigOptions = {
  host: process.env.nightwatcher_host,
  port: process.env.nightwatcher_port,
  mqtt: process.env.nightwatcher_mqtt || 'mqtt://localhost',
  rethinkdb: {
    host: process.env.nightwatcher_rethinkdb || 'localhost',
    port: process.env.nightwatcher_rethinkdb_port || 28015,
    db: 'nightwatcher'
  }
};

console.log("CONFIG:");
console.log(config);