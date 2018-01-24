/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {replaceStart} from '../../tools';

const id= replaceStart('', '');
const addStart = replaceStart('', 'blub');
const delStart = replaceStart('blub', '');
const modStart = replaceStart('blub', 'truc');

const noMatch = ['', '1', 'blob', 'tric trac truc'];

noMatch.map(s => test(t => t.is(id(s), s)));
noMatch.map(s => test(t => t.is(addStart(s), `blub${s}`)));
noMatch.map(s => test(t => t.is(delStart(s), s)));
noMatch.map(s => test(t => t.is(modStart(s), s)));

test(t => t.is(delStart('blub'), ''));
test(t => t.is(delStart('blubblob'), 'blob'));

test(t => t.is(modStart('blub'), 'truc'));
test(t => t.is(modStart('blubblob'), 'trucblob'));
