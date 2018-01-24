/* eslint-disable fp/no-unused-expression */

import td from 'testdouble';

export default scenario => {
  const rawMQTT = td.object(['subscribe', 'unsubscribe', 'on']);
  const mqtt = {...rawMQTT, disconnecting: true};
  const runScenario = (scenario, messageHandler) => {
    if (scenario.length < 1) { return false; }
    const [ms, {topic, message}] = scenario[0];
    return setTimeout(() => {
      messageHandler(topic, message);
      return runScenario(scenario.slice(1), messageHandler);
    }, ms);
  };
  // Node.js callbacks enforce null error parameter on success
  // eslint-disable-next-line fp/no-nil
  td.when(mqtt.subscribe(td.matchers.anything())).thenCallback(null, {granted: []});
  td.when(mqtt.on('message', td.matchers.isA(Function))).thenDo((_, messageHandler) => runScenario(scenario, messageHandler));
  td.when(mqtt.on('close'), {delay: scenario.reduce((a, [ms]) => a + ms, 50)}).thenCallback();
  return mqtt;
};
