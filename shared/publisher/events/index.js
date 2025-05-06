const EventEmitter = require('events');
const eventBus = new EventEmitter();

const send = (event, payload) => eventBus.emit(event, payload);

const listen = (event, callback) => eventBus.on(event, callback);

module.exports = { send, listen };