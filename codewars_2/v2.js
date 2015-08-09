// Implementation of LRU Cache. Version 1
"use strict";

function LRUCache(capacity, initial) {
  Object.defineProperty(this, 'capacity', {
    get: function() { return this.capacityValue; }.bind(this),
    set: function(newVal) {
      // If reducing the capacity, we need to throw away non-recently-used
      // variables.
      this.capacityValue = newVal;
      reduceSizeToCapacity.call(this);
    }.bind(this)
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
  Object.defineProperty(this, 'sizeValue', {
    value: 0,
    writable: true
  });
  Object.defineProperty(this, 'capacityValue', {
    value: capacity,
    writable: true
  });
  Object.defineProperty(this, 'cachedValues', {
    value: [],
    writable: true
  });

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
      return this.find(key).value;
    }.bind(this),
    set: function(newVal) {
      var pre_existing = this.find(key)
      // If this is a brand new item, create and push it
      if ( !pre_existing ) {
        console.log("Cached item never seen before. Adding")
        this.cachedValues.unshift({
          key:   key,
          value: newVal
        });
      }
      // If we already have this item in the cache, we just update it's value
      else {
        console.log("Cached item seen before. Updating")
        pre_existing.value = newVal;
        console.log(this.cachedValues)
      }

      triggerUpdateOnKey.call(this, key);

      return this.find(key).value;
    }.bind(this)
  });

  // Now that the property is defined, we need to actually set the value
  this[key] = val;

  // Allow Chaining
  return this;
}

LRUCache.prototype.delete = function(key) {
  // To mimic the 'delete' keyword, we need to return false when trying to
  // delete a non-configurable property like 'delete' or 'cache'.
  var non_config_props = Object.keys(LRUCache.prototype);
  if ( non_config_props.indexOf(key) !== -1 ) return false;

  // If the key isn't in our cache, we still need to return true.
  // Such is the weird behaviour the CodeWars problem wants us to mimic.
  var index = this.indexOf(key);
  console.log(key, "has an index of", index)
  if ( index === -1 )
    return true;


  if ( !(delete this[key]) ) {
    console.log("Accessor could not be deleted");
    return false;
  }

  // 'Splice' is a method that creates a new copy of the array with certain
  // values removed, and sets the original variable to point at this new array.
  // It returns the removed value.
  var removed_val = this.cachedValues.splice(index, 1);

  // If there IS a removed value, we know the delete worked
  if ( removed_val.length > 0 ) {
    // Update our 'size' variable
    this.size -= removed_val.length;
    return true;
  }
}

LRUCache.prototype.indexOf = function(key) {
  // Finds the index of an object in the cachedValues array
  var found_index;

  this.cachedValues.forEach( function(cacheItem, index) {
    if ( cacheItem.key === key )
      return found_index = index;
  }, this);

  var is_undefined = (typeof found_index) === 'undefined';

  return is_undefined ? -1 : found_index;
};

LRUCache.prototype.find = function(key) {
  var index = this.indexOf(key);

  if ( index !== -1 )
    return this.cachedValues[index]
  else
    return null
}

LRUCache.prototype.list = function() {
  return this.cachedValues;
}

// Private method that
//  - 1. reorders the keys so that the requested item gets moved to the front.
//  - 2. updates size of the cache
//  - 2. Removes the oldest item if necessary
var triggerUpdateOnKey = function(key) {
  var keys_index = this.indexOf(key);
  this.cachedValues.move(keys_index, 0);

  this.size = this.cachedValues.length;

  // Delete old items if necessary
  reduceSizeToCapacity.call(this);
}

// Private method called when the size exceeds capacity.
// Removes as many old items as necessary until capacity is reached.
var reduceSizeToCapacity = function() {
  // Find out how many items we are over. Eg. If capacity is 3 and size is 5,
  // we're over the limit by 2
  var amount_over_limit = this.size - this.capacity;
  console.log("Amount over limit:", amount_over_limit);
  console.log("Cached values", this.cachedValues);
  console.log("last", this.cachedValues.last());
  while ( amount_over_limit > 0) {
    var oldest_key = this.cachedValues.last().key;
    this.delete(oldest_key);
    amount_over_limit--;
  }
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

console.log("b is", store.b);
console.log("cache should be 'b, d, c'")
console.log("a should be undefined", store.a)
store.capacity = 1;
console.log(Object.keys(store))
