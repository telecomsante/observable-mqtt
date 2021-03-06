/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import Observable from 'zen-observable';
import {connect} from 'mqtt';
import uuid from 'uuid/v4';
import {promisify} from '../tools';
import observableMQTT from '..';

const subscriber = observableMQTT(Observable);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

test('inexistent host', t => {
  const connection = connect({host: 'inexistent_host'});
  const end = promisify(connection.end.bind(connection, true));
  const subscribe = subscriber(connection);
  const subscription = subscribe('truc');
  t.plan(1);
  return Promise.all([
    wait(100).then(() => end()),
    subscription
      .forEach(() => t.fail())
      .then(() => t.pass())
  ]);
});

test('grant with right options', t => {
  const connection = connect({host: 'mqtt', port: 1883});
  const subscribe = subscriber(connection);
  const topic = `${uuid()}/test`;
  const qos = 1;
  t.plan(2);
  // eslint-disable-next-line fp/no-nil
  return t.notThrows(subscribe(topic, {qos}).forEach(
    ({granted: receivedGranted}) => connection.end(() => t.deepEqual(receivedGranted, [{topic, qos}]))
  ));
});

test('wildcard topics', t => {
  const connection1 = connect({host: 'mqtt', port: 1883});
  const connection2 = connect({host: 'mqtt', port: 1883});
  const subscribe = subscriber(connection1);
  const publish = promisify(connection2.publish.bind(connection2));
  const id = uuid();
  const subscription = subscribe({
    [`${id}/one/+`]: 1,
    [`${id}/many/#`]: 1
  }).forEach(({topic, message}) => {
    switch(topic) {
    case `${id}/one/blub`:
      t.is(message.toString(), 'blob');
      break;
    case `${id}/many/blub/blib`:
      t.is(message.toString(), 'troc');
      connection2.end(() => connection1.end());
      break;
    default:
      if (topic) { t.fail(); }
    }
    return true;
  });
  t.plan(2);
  publish(`${id}/one/blub`, 'blob')
    .then(() => publish(`${id}/one/blub/blib`, 'truc'))
    .then(() => publish(`${id}/many/blub/blib`, 'troc'));
  return subscription;
});
