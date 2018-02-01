/*
Copyright 2018 Matti Hiltunen

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const nats = require('nats');

module.exports = {
  configure: (config) => {
    if (process.env.NATS_SERVERS) {
      config.natsServers = process.env.NATS_SERVERS.split(',');
    } else {
      config.natsServers = [ 'nats://localhost:4222' ];
    }
  },
  init: (service) => {
    service.natsClient = nats.connect({
      servers: service.config.natsServers,
    });
    service.natsClient.on('connect', () => service.logger.info('NATS connected'));
    service.natsClient.on('reconnect', () => service.logger.info('NATS reconnected'));
    service.natsClient.on('disconnect', () => service.logger.info('NATS disconnected'));
    service.natsClient.on('close', () => service.logger.info('NATS closed'));
    service.natsClient.on('error', err => service.logger.error(`NATS error`, err));
  }
};
