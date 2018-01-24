/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {sideEffects} from '../../tools';

/* sideEffects is expected to return true whatever its input is.
 * There is no point testing all possible arguments.
 */
test(t => t.true(sideEffects()));
