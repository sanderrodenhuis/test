let EventEmitter = require('events');


const pubsub = new EventEmitter();
pubsub.setMaxListeners(100);

function emit(event, type, args) {
  pubsub.emit(`${event}.${type}`, args);
}
function on(event, type, callback) {
  pubsub.on(`${event}.${type}`, callback);
}
module.exports = {
  emit,
  on
};
