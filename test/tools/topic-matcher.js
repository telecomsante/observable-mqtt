/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {topicsMatcher} from '../../tools';

const simpleTopics = [
  'root/sub/leaf',
  'truc/tric',
  'long/topic/tree/to/follow'
];

const noMatch = topicsMatcher([]);
const oneTopic = topicsMatcher([simpleTopics[1]]);
const manyTopics = topicsMatcher(simpleTopics);
const startPlusTopic = topicsMatcher(['+/sub/leaf']);
const middlePlusTopic = topicsMatcher(['root/+/leaf']);
const endPlusTopic = topicsMatcher(['root/sub/+']);
const hashTopic = topicsMatcher(['root/sub/#']);

const noMatchSamples = ['', 'abc', 'abc/def', 'abc/def/ghi'];

noMatchSamples.map(topic => test(t => t.false(noMatch(topic))));

noMatchSamples.map(topic => test(t => t.false(oneTopic(topic))));
[
  'root', 'root/', 'root/sub', 'root/sub/', 'root/sub/lea', 'oot/sub/leaf',
  '/sub/leaf', 'sub/leaf', '/leaf', 'leaf', 'root/sub/leaf/', 'root/sub/leaf/blub'
].map(topic => test(t => t.false(oneTopic(topic))));

test(t => t.true(oneTopic(simpleTopics[1])));

noMatchSamples.map(topic => test(t => t.false(manyTopics(topic))));
simpleTopics.map(topic => test(t => t.true(manyTopics(topic))));

[...noMatchSamples, 'root/blub/leaf', 'root/sub/blub', '1/2/sub/leaf', '//sub/leaf'].map(topic => test(t => t.false(startPlusTopic(topic))));
['root/sub/leaf', '1/sub/leaf', '/sub/leaf'].map(topic => test(t => t.true(startPlusTopic(topic))));

[...noMatchSamples, 'root/blub', 'blub/leaf', 'root///leaf'].map(topic => test(t => t.false(middlePlusTopic(topic))));
['root/blub/leaf', 'root/1/leaf', 'root//leaf'].map(topic => test(t => t.true(middlePlusTopic(topic))));

[...noMatchSamples, 'root/blub/leaf', 'blub/sub/leaf', 'root/sub/1/2', 'root/sub//'].map(topic => test(t => t.false(endPlusTopic(topic))));
['root/sub/leaf', 'root/sub/1', 'root/sub/'].map(topic => test(t => t.true(endPlusTopic(topic))));

[...noMatchSamples, 'root/blub/leaf', 'blub/sub/leaf', '/root/sub/leaf'].map(topic => test(t => t.false(hashTopic(topic))));
['root/sub/leaf', 'root/sub/1', 'root/sub', 'root/sub/', 'root/sub//', 'root/sub/1/', 'root/sub/1/2', 'root/sub/1/2/', 'root/sub///'].map(topic => test(t => t.true(hashTopic(topic))));
