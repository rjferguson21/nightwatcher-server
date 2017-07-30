import * as Hapi from 'hapi';
import * as Nes from 'nes';

const server = new Hapi.Server();
server.connection({ port: 3000, host: 'localhost' });

server.route({
  method: 'GET',
  path: '/',
  handler: function (request, reply) {
    reply('Hello, world!');
  }
});

server.register(Nes, (err) => {
  server.start(function (err) {
    server.broadcast('welcome!');
  });
});

server.start((err) => {
  if (err) {
    throw err;
  }
  console.log(`Server running at: ${server.info.uri}`);
});