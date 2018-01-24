const {arrayize, topicsMatcher, sideEffects, promisify} = require('./tools');

module.exports = Observable => mqtt => {
  const subscribe = promisify(mqtt.subscribe.bind(mqtt));
  const unsubscribe = promisify(mqtt.unsubscribe.bind(mqtt));
  return (topic) => {
    const topics = arrayize(topic);
    const match = topicsMatcher(topics);
    const subscription = subscribe(topic);
    // the MQTT side effects are encapsulated in the Observable monad (at least I hope so)
    return new Observable(observer => sideEffects(
      subscription.then(granted => observer.next({granted}), err => observer.error(err)),
      mqtt.on('message', (topic, message) => match(topic) ? observer.next({topic, message}) : false),
      mqtt.on('close', () => mqtt.disconnecting ? observer.complete() : false)
    ) && (() => unsubscribe(topics).catch(() => true))); // unsubscribe can fail during disconnection
  };
};