import * as Hapi from 'hapi';
import * as Nes from 'nes';
import * as mqtt from 'mqtt';
import { config } from './config';
import r from './connection';

const server = new Hapi.Server();
server.connection({ port: 3000, host: '0.0.0.0' });

server.route({
  method: 'GET',
  path: '/hello',
  handler: function (request, reply) {
    reply('Hello, world!');
  }
});

server.route({
  method: 'GET',
  path: '/sensors',
  handler: function (request, reply) {
    r.table('sensors').run().then( data => {
      reply(JSON.stringify(data));
    })
  }
});

server.register({ register: Nes, options: { auth: false } }, (err) => {
  server.start(function (err) {
    if (err) {
      throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
    
    let client = mqtt.connect(config.mqtt);

    client.on('connect', function () {
      console.log('connected to mqtt');
      client.subscribe('envisalink/#');
    });

    client.on('message', (topic, message) => {
      console.log(topic, message);
      let id = topic.split('/')[1]
      let data = { 
        id, 
        status: message.toString(),
        lastUpdated: new Date()
      };

      r.table('sensors').insert(data, { conflict: 'update' }).run();
      console.log('broadcast');
      server.broadcast(data);
    });
  });
});