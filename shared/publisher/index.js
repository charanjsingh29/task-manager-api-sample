const events = require('./events');

const send = function (event, meta, data) {
  const QUEUE_SYSTEM = process.env.QUEUE_SYSTEM || 'none';
  const payload = {
    meta,
    data
  };

  switch (QUEUE_SYSTEM) {
    case 'event_emitter':
      events.send(event, payload);
      break;
    case 'kafka':
      // TODO: implement kafka sender
      break;
    default:
        // TODO; directily added to database
      break;
  }
  
};

const listen = function (event, callback) {
    const QUEUE_SYSTEM = process.env.QUEUE_SYSTEM || 'none';
  
    switch (QUEUE_SYSTEM) {
      case 'event_emitter':
        events.listen(event, callback);
        break;
      case 'kafka':
        // TODO: implement kafka sender
        break;
      default:
        // TODO; directily added to database
        break;
    }
  }

module.exports = { send, listen };