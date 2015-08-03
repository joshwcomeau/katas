// Implementation of LRU Cache. Version 1
"use strict";

function LRUCache(capacity, initial) {
  this.initialize(capacity, initial);
  var self = this

  Object.defineProperty(this, 'capacity', {
    get: function() { return self.capacityValue; },
    set: function(newVal) { self.capacityValue = newVal; }
  });

  Object.defineProperty(this, 'size', {
    get: function() { return self.sizeValue; }
  });
}

LRUCache.prototype.initialize = function(capacity, initial) {
  // Set our internally tracked values
  this.sizeValue = 0;
  this.capacityValue = capacity;

  // Iterate through our initial values, adding them to the cache.
  for (var prop in initial) {
    this.cache(prop, initial[prop]);
  }
}

LRUCache.prototype.cache = function(key, val) {
  console.log("Caching", key, "with val of", val);
}

var store = new LRUCache(5, {a: 5, b:12});
console.log("initial capacity should be 5; it is:", store.capacity);
store.capacity = 10;
console.log("After setting to 10, it is:", store.capacity);
