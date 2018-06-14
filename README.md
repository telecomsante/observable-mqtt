# Observable [MQTT.js]

The purpose of this library is to provide a way to follow a [MQTT.js] subscription through an [Observable].

Get the library with `npm install observable-mqtt`.

Then:

```js
const Observable = require('zen-observable');
const observableMQTT = require('observable-mqtt')(Observable);
const {connect} = require('mqtt');

const subscribe = observableMQTT(connect({host:'mqtt', port: 1883}));

subscribe(['root/lvl1/+', 'root/lvl2/#'], {qos: 1})
  .map(({topic, message}) => {
    if (topic) { console.log(message.toString()); }
  });
```

`subscribe` takes the same arguments than [MQTT.js subscribe] but for the last `callback` argument.

> The library was tested with [zen-observable](https://github.com/zenparsing/zen-observable) but any compliant [Observable] library should be usable.

The Observable returned by `subscribe(...)` will emit three types of values:

- `{granted: {topic: 'a/mqtt/topic', qos: 1}`: this type of value is emitted once the subscription was granted (see [mqtt.Client#subscribe](https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback));
- `{topic: 'a/mqtt/topic', message: Buffer}`: this type of value is emitted each time a message payload is published on one of the subscribed topics (see [Event 'message'](https://github.com/mqttjs/MQTT.js#event-message));
- `{error: new Error('some error')}`: this type of value is emitted only when a [reconnecting MQTT client](https://github.com/mqttjs/MQTT.js#mqttclientreconnecting) is used and an error was reported by the MQTT client (see [Event 'error'](https://github.com/mqttjs/MQTT.js#event-error)).

[MQTT.js]: https://github.com/mqttjs/MQTT.js
[MQTT.js subscribe]: https://github.com/mqttjs/MQTT.js#mqttclientsubscribetopictopic-arraytopic-object-options-callback
[Observable]: https://github.com/tc39/proposal-observable
