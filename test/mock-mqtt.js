/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import td from 'testdouble';
import Observable from 'zen-observable';
import observableMQTT from '..';
import {arrayize, topicsMatcher} from '../tools';
import autoMQTT from './helpers/auto-mqtt';

const subscribe = observableMQTT(Observable);

test(t => {
  const mqtt = td.object(['subscribe', 'unsubscribe', 'on']);
  const observable = subscribe(mqtt);
  t.plan(1);
  td.when(mqtt.subscribe('blub/blob')).thenCallback(new Error('test'));
  return t.throws(observable('blub/blob').forEach(() => t.fail()), Error, 'test');
});

test(t => {
  const rawMQTT = td.object(['subscribe', 'unsubscribe', 'on']);
  const mqtt = {...rawMQTT, disconnecting: true};
  const observable = subscribe(mqtt);
  const topic = 'blub/blob';
  const granted = [{topic, qos: 0}];
  t.plan(2);
  // eslint-disable-next-line fp/no-nil
  td.when(mqtt.subscribe(topic)).thenCallback(null, granted);
  td.when(mqtt.on('close'), {delay: 10}).thenCallback();
  return t.notThrows(observable(topic).forEach(({granted: receivedGranted}) => {
    return t.deepEqual(receivedGranted, granted);
  }));
});

test(async t => {
  const rawMQTT = td.object(['subscribe', 'unsubscribe', 'on']);
  const mqtt = {...rawMQTT, disconnecting: false};
  const observable = subscribe(mqtt);
  const topic = 'blub/blob';
  const granted = [{topic, qos: 0}];
  t.plan(2);
  // eslint-disable-next-line fp/no-nil
  td.when(mqtt.subscribe(topic)).thenCallback(null, granted);
  td.when(mqtt.on('close'), {delay: 10}).thenCallback();
  return t.is(await Promise.race([
    observable(topic).forEach(({granted: receivedGranted}) => {
      return t.deepEqual(receivedGranted, granted);
    }),
    new Promise(resolve => setTimeout(() => resolve('test'), 50))
  ]), 'test');
});

[{
  scenario: [
    [0, {topic: 'blib', message: 'blob'}],
    [10, {topic: 'blub/blob', message: 'blib'}]
  ],
  topic: 'blub/blob'
}, {
  scenario: [
    [0, {topic: 'blib', message: 'blob'}],
    [10, {topic: 'blub/blob', message: 'blib'}]
  ],
  topic: ['blib', 'blub/blob']
}, {
  scenario: [
    [10, {topic: 'starwars/rebel/chewbacca', message: true}],
    [10, {topic: 'pokemon/vol/carnarticho', message: true}],
    [10, {topic: 'starwars/empire/anakin-skywalker', message: true}],
    [10, {topic: 'pokemon/electrique/voltali', message: true}],
    [10, {topic: 'pokemon/plante/rafflesia', message: true}],
    [10, {topic: 'starwars/empire/wilhuff-tarkin', message: true}],
    [10, {topic: 'pokemon/eau/aquali', message: true}],
    [10, {topic: 'pokemon/feu/ponyta', message: true}],
    [10, {topic: 'starwars/rebel/luke-skywalker', message: true}],
    [10, {topic: 'pokemon/eau/magicarpe', message: true}],
    [10, {topic: 'pokemon/sol/sablaireau', message: true}],
    [10, {topic: 'pokemon/electrique/pikachu', message: true}],
    [10, {topic: 'pokemon/feu/feunard', message: true}],
    [10, {topic: 'starwars/rebel/han-solo', message: true}],
    [10, {topic: 'pokemon/eau/otaria', message: true}],
    [10, {topic: 'starwars/empire/palpatine', message: true}],
    [10, {topic: 'pokemon/vol/roucoole', message: true}]
  ],
  topic: ['pokemon/eau/+', 'pokemon/feu/+', 'starwars/#']
}].map(({scenario, topic}) => test(t => {
  const match = topicsMatcher(arrayize(topic));
  const observable = subscribe(autoMQTT(scenario));
  // notThrow + accumulator deep equal
  t.plan(2);
  return t.notThrows(observable(topic)
    .filter(({granted}) => !granted)
    .reduce((acc, pub) => [...acc, pub], [])
    .forEach(acc => t.deepEqual(acc, scenario.map(s => s[1]).filter(s => match(s.topic))))
  );
}));
