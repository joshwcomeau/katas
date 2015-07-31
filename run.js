var benchmark   = require('./benchmark');

var version1    = require('./codewars_1/version_1');
var version2    = require('./codewars_1/version_2');
var footnotes1  = require('./codewars_1/footnotes_1');
var footnotes2  = require('./codewars_1/footnotes_2');
var final       = require('./codewars_1/final');

// Our pseudorandom number for testing.
var random_num = '4945647369604558894304153276607440775176393799484894902216270566113395072519779263295624428428157834';

var time_v1 = benchmark.run(version1, random_num, 1000000);
console.log("V1:   ", time_v1, "ms");

var time_v2 = benchmark.run(version2, random_num, 1000000);
console.log("V2:   ", time_v2, "ms   (breaks on sequences that don't contain 9)");

var time_fin = benchmark.run(final, random_num, 1000000);
console.log("final:", time_fin, "ms");

var time_fn1 = benchmark.run(footnotes1, random_num, 1000000);
console.log("FN1:  ", time_fn1, "ms   (does not use String.prototype.slice)");

var time_fn2 = benchmark.run(footnotes2, random_num, 1000000);
console.log("FN2:  ", time_fn2, "ms  (uses all-integer comparisons)");
