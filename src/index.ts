import { SensorService } from './sensors';
import { HistoryService } from './history';
import * as Hapi from 'hapi';
import * as Nes from 'nes';
import * as mqtt from 'mqtt';
import { config } from './config';
import { initDB, getMQTTConnection } from './connection';
import { Sensor } from './sensors/sensor';
import { connect } from 'mqtt';

const server = new Hapi.Server();
server.connection({ port: 3000, host: '0.0.0.0' });

initDB().then(r => {
  const sensors = new SensorService(r);
  const history = new HistoryService(r);

  server.route({
    method: 'GET',
    path: '/healthy',
    handler: function (request, reply) {
      reply('true!');
    }
  });

  server.route({
    method: 'GET',
    path: '/sensors',
    handler: function (request, reply) {
      sensors.list().then( data => {
        reply(JSON.stringify(data));
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/sensors/{id}/history',
    handler: function (request, reply) {
      sensors.history(request.params.id).then(data => {
        reply(JSON.stringify(data));
      })
    }
  });

  server.route({
    method: 'GET',
    path: '/sensors/{id}',
    handler: function (request, reply) {
      sensors.get(request.params.id).then(data => {
        reply(JSON.stringify(data));
      })
    }
  });

  server.route({
    method: 'PUT',
    path: '/sensors/{id}',
    handler: function (request, reply) {
      getMQTTConnection().then((mqttConn) => {
        mqttConn.publish(`nightwatcher/${request.params.id}/set`, request.payload.value)
        reply(JSON.stringify({ id: request.params.id, value: request.payload.value }));
      });
    }
  });

  server.route({
    method: 'GET',
    path: '/history',
    handler: function (request, reply) {
      const start = new Date(request.query.start);
      const end = new Date(request.query.end);
      history.list(start, end).then(data => {
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
      
      getMQTTConnection().then((mqttConn) => {
        console.log('connected to mqtt');
        mqttConn.subscribe('envisalink/#');
        mqttConn.subscribe('nightwatcher/#');
        mqttConn.subscribe('tplink/#');

        mqttConn.on('message', (topic, message) => {
          console.log(topic, message);
          let id = topic.split('/')[1]
          let data = { 
            id, 
            status: message.toString(),
            lastUpdated: new Date()
          };

          sensors.update(data as Sensor);
          
          console.log('broadcast');
          server.broadcast(data);
        });
      });
    });
  });
}); 