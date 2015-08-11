// Implementation of LRU Cache. Compliant version.
// This is a slight edit made to try and appease the absurdly strict rules
// of the CodeWars Kata. Turns out that while it passes the shown tests,
// it fails the secret ones. And since I have no way of knowing what those
// tests are, I've reached out to the kata writer. If he gets back to me,
// this version may be updated and made final.
"use strict";

function LRUCache(capacity, initial) {
  // Our cache has two main properties: capacity and size.
  // These public-facing properties update private properties 'sizeValue'
  // and 'capacityValue', assigned in our initialize method below.
  Object.defineProperty(this, 'capacity', {
    get: function() { return this.capacityValue; }.bind(this),
    set: function(newVal) {
      this.capacityValue = newVal;

      // If we've reduced the capacity, we may need to delete some items,
      // so that the size doesn't exceed the available capacity.
      reduceSizeToCapacity.call(this);
    }.bind(this)
  });

  Object.defineProperty(this, 'size', {
    get: function() { return this.sizeValue; }.bind(this),
    set: function(newVal) { return this.sizeValue = newVal; }.bind(this)
  });

  Object.defineProperty(this, 'delete', {
    enumerable: false,
    writable: false,
    configurable: true,
    value: function(key) {
      // To mimic the 'delete' keyword, we need to return false when trying to
      // delete a non-configurable property like 'delete' or 'cache'.
      var non_config_props = Object.keys(LRUCache.prototype);
      if ( non_config_props.indexOf(key) !== -1 ) return false;

      // Don't delete any functions, like 'delete', either
      if ( typeof this[key] === 'function' )
        return false;



      // If the key isn't in our cache, we still need to return true.
      // Such is the weird behaviour the CodeWars problem wants us to mimic.
      var index = this.indexOf(key);
      console.log(key, "has an index of", index)
      if ( index === -1 )
        return true;

      // We also need to delete the custom property defined in .cache
      delete this[key]

      // 'Splice' is a method that creates a new copy of the array with certain
      // values removed, and sets the original variable to point at this new array.
      // It returns the removed value.
      var removed_val = this.cachedValues.splice(index, 1);

      // If there IS a removed value, we know the delete worked.
      // Update our 'size' value.
      if ( removed_val.length > 0 )
        this.size -= removed_val.length;


      return true;
    }
  });



  // Invoke private initialize method
  initialize.call(this, capacity, initial);
}

var initialize = function(capacity, initial) {
  // Set our internally tracked values.
  // We're doing it this way so that they aren't enumerable;
  // when iterating through our cache, we'll only display user-created values.
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
  // This is how users add new properties to the cache.
  // We need to create the custom getters and setters, so in the future they
  // can read/write from the cache with this key.
  Object.defineProperty(this, key, {
    // 'enumerable' sets whether this property will show up when
    // iterating through an object with for..of loops
    enumerable: true,

    // 'configurable' sets whether this property can be deleted.
    configurable: true,

    get: function() {
      // Whenever we access an item, we need to move it to the front of the
      // array. Our private trigger method, defined below, takes care of this.
      triggerUpdateOnKey.call(this, key);

      // Return the requested value.
      return this.find(key).value;
    }.bind(this),

    set: function(newVal) {
      // We need to figure out if we're adding a brand new item, or updating
      // an existing item.
      var pre_existing = this.find(key)

      if ( !pre_existing ) {
        // If it's new, we need to add it to the front of the array...
        this.cachedValues.unshift({
          key:   key,
          value: newVal
        });

        // ...and update the size of the cache...
        this.size++;

        // ...and delete old items if necessary
        reduceSizeToCapacity.call(this);

      } else {
        // If we already have this item in the cache, we update it's value
        pre_existing.value = newVal;

        // We also need to move it to the front of the array.
        triggerUpdateOnKey.call(this, key);
      }

      return this.find(key).value;
    }.bind(this)
  });

  // We've defined a brand new property, but it currently has no value.
  // Let's use our new 'setter' method to give it its initial value.
  this[key] = val;

  // Allow chaining by returning our cache object.
  return this;
}



LRUCache.prototype.indexOf = function(key) {
  // A convenience method that mimics Array.prototype.indexOf.
  // Returns the index of the supplied key, or -1 if it cannot be found.
  var found_index = -1;

  this.cachedValues.forEach( function(cacheItem, index) {
    if ( cacheItem.key === key )
      return found_index = index;
  }, this);

  return found_index;
};

LRUCache.prototype.find = function(key) {
  // Similar to .indexOf, but it returns the full cache object, not just the
  // key. Returns 'null' if the object cannot be found.

  var index = this.indexOf(key);

  return index !== -1 ? this.cachedValues[index] : null;
}

LRUCache.prototype.list = function() {
  // Publicly expose a copy of our internal cache.
  return this.cachedValues.slice();
}

  //////////////////////////////////////
 ////////// PRIVATE METHODS ///////////
//////////////////////////////////////

var triggerUpdateOnKey = function(key) {
  // This is called whenever a property is retrieved or set. It re-orders the
  // cache so that this object is right at the front.
  var keys_index = this.indexOf(key);
  this.cachedValues.move(keys_index, 0);
}

var reduceSizeToCapacity = function() {
  // This is called when we add new items to the cache, or reduce the cache's
  // capacity. It removes items, from the oldest to the newest, until our
  // cache's size is equal to its capacity.
  var amount_over_limit = this.size - this.capacity;

  while ( amount_over_limit > 0) {
    var oldest_key = this.cachedValues.last().key;
    this.delete(oldest_key);
    amount_over_limit--;
  }
}

  //////////////////////////////////////
 /////////// MONKEY PATCHES ///////////
//////////////////////////////////////

// So, it's generally a bad idea to do this, as it confuses people when they
// see a weird method called on a native array. Still, I think it's cool, and
// this is just a fun challenge =)

Array.prototype.move = function(old_index, new_index) {
  // Convenience method to move an item within an array.
  this.splice(new_index, 0, this.splice(old_index, 1)[0]);
  return this;
};

Array.prototype.last = function() {
  // Gets the last (and, in our case, oldest) item in an array.
  return this[this.length-1];
}

module.exports = LRUCache;
