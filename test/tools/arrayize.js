/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {arrayize} from '../../tools';

test(t => t.deepEqual(arrayize([]), []));
test(t => t.deepEqual(arrayize({}), []));
test(t => t.deepEqual(arrayize(123), [123]));
test(t => t.deepEqual(arrayize('blub/blob/blib'), ['blub/blob/blib']));
test(t => t.deepEqual(arrayize([1, 2, 3]), [1, 2, 3]));
test(t => t.deepEqual(arrayize({a: 1}), ['a']));
test(t => t.deepEqual(arrayize({a: 1, b: 2}), ['a', 'b']));
