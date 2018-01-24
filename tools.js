// eslint-disable-next-line fp/no-rest-parameters
const pipe = (...args) => args.reduce((p, f) => v => f(p(v)), v => v);

const primitize = thing => thing.valueOf();
const toArray = thing => thing instanceof Array ? thing : typeof thing === 'object' ? Object.keys(thing) : [thing];
const arrayize = pipe(primitize, toArray);

// eslint-disable-next-line fp/no-rest-parameters
const promisify = f => (...args) => new Promise((resolve, reject) => f(...args, (err, ...args) => err ? reject(err): resolve(...args)));

const replaceEnd = (pattern, replacement) => {
  const removeEnd = pattern.length ? s => s.slice(0, -pattern.length) : s => s;
  return string => string.endsWith(pattern) ? `${removeEnd(string)}${replacement}` : string;
};

const replaceStart = (pattern, replacement) => string => string.startsWith(pattern) ? `${replacement}${string.slice(pattern.length)}` : string;

/* Execute side effects as arguments to this function:
 * return sideEffects(e1, e2, ..., en) && result;
 */
const sideEffects = () => true;

/* MQTT wildcards functions, source: https://www.ibm.com/support/knowledgecenter/en/SSCGGQ_1.2.0/com.ibm.ism.doc/Overview/ov00032.html */

/* The topic-based wildcard scheme allows you to select publications grouped by topic level.
 * You can choose for each level in the topic hierarchy, whether the string in the subscription for
 * that topic level must exactly match the string in the publication or not. For example the subscription,
 * Sport/+/Finals selects all the topics,
 *  - "Sport/Tennis/Finals"
 *  - "Sport/Basketball/Finals"
 *  - "Sport/Swimming/Finals"
 *
 * Also the single-level wildcard character '+' matches one, and only one, topic level.
 * For example, 'Sport/+' matches 'Sport/Tennis', but not 'Sport/Tennis/Finals'.
 * Because the single-level wildcard matches only a single level, 'Sport/+' does not match 'Sport'.
 */
const startPlus = replaceStart('+/', '[^/]*/');
const middlePlus = string => string.replace('/+/', '/[^/]*/');
const endPlus = replaceEnd('/+', '/[^/]*');

/* The multilevel wildcard character '#' is used to match any number of levels within a topic.
 * For example, if you subscribe to 'Sport/Tennis/#', you receive messages on topics 'Sport/Tennis'
 * and 'Sport/Tennis/Finals'.
 */
const endHash = replaceEnd('/#', '(/.*)?');

const fullMatchRegex = string => new RegExp(`^${string}$`);

const topicsMatcher = topics => {
  const regexps = topics.map(pipe(startPlus, middlePlus, endPlus, endHash, fullMatchRegex));
  return topic => regexps.some(r => r.test(topic));
};

module.exports = {
  arrayize,
  pipe,
  promisify,
  replaceEnd,
  replaceStart,
  sideEffects,
  topicsMatcher
};
