// Implementation of LRU Cache. Version 1
"use strict";

function LRUCache(capacity, initial) {
  Object.defineProperty(this, 'capacity', {
    get: function() { return this.capacityValue; }.bind(this),
    set: function(newVal) { return this.capacityValue = newVal; }.bind(this)
  });

  Object.defineProperty(this, 'size', {
    get: function() { return this.sizeValue; }.bind(this),
    set: function(newVal) { return this.sizeValue = newVal; }.bind(this)
  });

  // Invoke private initialize method
  initialize.call(this, capacity, initial);

}

var initialize = function(capacity, initial) {
  // Set our internally tracked values
  this.sizeValue = 0;
  this.capacityValue = capacity;
  this.cachedValues  = {};

  // Iterate through our initial values, adding them to the cache.
  for (var prop in initial) {
    // Create the getter/setter for key
    this.cache(prop, initial[prop]);
  }
}

LRUCache.prototype.cache = function(key, val) {
  // Define a property with the new key on the cache, along with a timestamp
  Object.defineProperty(this, key, {
    get: function() {
      triggerUpdateOnKey.call(this, key);
      console.log("Cached state:",this.cachedValues);
      return this.cachedValues[key].value;
    }.bind(this),
    set: function(newVal) {
      // Update or create this key. Doesn't matter if it had a prior value
      this.cachedValues[key] = {
        value: newVal
      }

      triggerUpdateOnKey.call(this, key);
      return this.cachedValues[key];
    }.bind(this)
  });

  // Now that the property is defined, we need to actually set the value
  this[key] = val;

  // Allow Chaining
  return this;
}

LRUCache.prototype.delete = function(key) {
  console.log("Attempting to delete", key)
}

// Private method that
//  - 1. updates the timestamp on the retrieved cache item
//  - 2. updates size of the cache
//  - 2. Removes the oldest item if necessary
var triggerUpdateOnKey = function(key) {
  this.cachedValues[key].retrievedAt = Date.now();

  this.size = Object.keys(this.cachedValues).length;

  if ( this.size > this.capacity ) {
    // Our cache is overstuffed; we need to remove the oldest item
    var oldestItem = findOldest.call(this);
    this.delete(oldestItem);
  }
  console.log("size is now", this.size);
}

// Private method that returns the oldest item in the cache
var findOldest = function() {
  var oldest = {
    retrievedAt: Infinity
  };
  var oldestKey = null;

  for (var prop in this.cachedValues) {
    if ( this.cachedValues[prop].retrievedAt < oldest.retrievedAt ) {
      oldest = this.cachedValues[prop];
      oldestKey = prop;
    }
  }
  console.log("oldest is", oldestKey);
  return oldestKey;
}


var store = new LRUCache(3, {a: 5});
console.log("A is",store.a);
store.cache('b', 12);
store.cache('c', 15);
store.cache('d', 25);
