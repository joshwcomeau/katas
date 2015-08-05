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
  this.cachedValues = [];

  // Iterate through our initial values, adding them to the cache.
  for (var prop in initial) {
    // Create the getter/setter for key
    this.cache(prop, initial[prop]);
  }
}

LRUCache.prototype.cache = function(key, val) {
  // Define a property with the new key on the cache, along with a timestamp
  Object.defineProperty(this, key, {
    enumerable: true,
    configurable: true,
    get: function() {
      triggerUpdateOnKey.call(this, key);
      console.log("Cached state:",this.cachedValues);
      return this.cachedValues[key].value;
    }.bind(this),
    set: function(newVal) {
      var cache_index = this.indexOf(key)
      // If this is a brand new item, create and push it
      if ( cache_index === -1 ) {
        console.log("Cached item never seen before. Adding")
        this.cachedValues.push({
          key:   key
          value: newVal
        });
        console.log(this.cachedValues)
      }
      // If we already have this item in the cache, we just update it's value
      else {
        console.log("Cached item seen before. Updating")
        this.cachedValues[cache_index].value = newVal;
        console.log(this.cachedValues)
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
  // The delete method should return a boolean based on whether it was able
  // to find and delete the key requested
  return delete this.cachedValues[key] && delete this[key];
}

LRUCache.prototype.indexOf = function(key) {
  // Finds the index of an object in the cachedValues array
  this.cachedValues.forEach( function(cacheItem, index) {
    if ( cacheItem.key === key ) return index;
  }, this);

  // If we made it here, it doesn't exist. Mimic Array.indexOf
  return -1;
};

// Private method that
//  - 1. reorders the keys so that the requested item gets moved to the front.
//  - 2. updates size of the cache
//  - 2. Removes the oldest item if necessary
var triggerUpdateOnKey = function(key) {
  var keys_index = this.cachedKeys.indexOf(key);
  this.cachedKeys.move(keys_index, 0);

  this.size = this.cachedKeys.length;

  if ( this.size > this.capacity ) {
    // Our cache is overstuffed; we need to remove the oldest item
    this.delete( this.cachedValues[this.cachedKeys.last] );
    this.cachedKeys.pop()
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


Array.prototype.move = function(old_index, new_index) {
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this;
};

Array.prototype.last = function() {
  return this[this.length-1];
}


var store = new LRUCache(3, {a: 5});
console.log("A is",store.a);
store.cache('b', 12);
store.cache('c', 15);
store.cache('d', 25);
store.b
console.log(store.a)
