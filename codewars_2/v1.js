// Implementation of LRU Cache. Version 1
function LRUCache(capacity, init) {
  var self = this;

  this.size = 0;
  // implement capacity getter/setter
  this.capacityValue = 3;

  Object.defineProperty(this, 'capacity', {
    get: function() { return self.capacityValue; },
    set: function(newVal) { self.capacityValue = newVal; }
  });
}

var store = new LRUCache();
console.log("initial capacity should be 3; it is:", store.capacity);
store.capacity = 10;
console.log("After setting to 10, it is:", store.capacity);
