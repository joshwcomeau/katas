var LRUCache = require('./codewars_2/final');

// Create a store with an initial value
var store = new LRUCache(3, {a: 5});

// Add a few more things
store.cache('b', 12);
store.cache('c', 15);
store.cache('d', 25);

// Because our capacity is 3, the oldest item should be booted out.
// That item should be 'a'
console.log("cache should be 'd, c, b'");
console.log(store.list())

// Accessing an item moves it to the front
console.log("b is", store.b);
console.log("cache should be 'b, d, c'");
console.log(store.list());

// Reducing the capacity should throw away all older items
store.capacity = 1;
console.log("Cache should just be 'b'")
console.log(store.list());
