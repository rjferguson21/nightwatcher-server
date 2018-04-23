import { SensorService } from './sensors';
import { HistoryService } from './history';
import * as Hapi from 'hapi';
import * as Nes from 'nes';
import * as mqtt from 'mqtt';
import { config } from './config';
import { initDB } from './connection';
import { Sensor } from './sensors/sensor';
import { MqttSubscriptions } from './subscriptions/subscription';
import winston from 'winston';

const server = new Hapi.Server();
server.connection({ port: 3000, host: '0.0.0.0' });

initDB().then(r => {
  const sensors = new SensorService();
  const history = new HistoryService();

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
      winston.info(`Server running at: ${server.info.uri}`);
      
      const mqttSubs = new MqttSubscriptions();
      mqttSubs.connect({ server });
    });
  });
});