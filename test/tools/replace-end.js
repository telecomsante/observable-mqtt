/* eslint-disable fp/no-unused-expression */

import test from 'ava';
import {replaceEnd} from '../../tools';

const id= replaceEnd('', '');
const addEnd = replaceEnd('', 'blub');
const delEnd = replaceEnd('blub', '');
const modEnd = replaceEnd('blub', 'truc');

const noMatch = ['', '1', 'blob', 'tric trac truc'];

noMatch.map(s => test(t => t.is(id(s), s)));
noMatch.map(s => test(t => t.is(addEnd(s), `${s}blub`)));
noMatch.map(s => test(t => t.is(delEnd(s), s)));
noMatch.map(s => test(t => t.is(modEnd(s), s)));

test(t => t.is(delEnd('blub'), ''));
test(t => t.is(delEnd('blobblub'), 'blob'));

test(t => t.is(modEnd('blub'), 'truc'));
test(t => t.is(modEnd('blobblub'), 'blobtruc'));
