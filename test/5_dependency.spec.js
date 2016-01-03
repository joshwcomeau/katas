var expect = require('chai').expect;

var DI = require('../5_dependency_injection/v1');

describe('Dependency Injector', function() {
  it('resolves dependencies', function() {
    var deps = {
      'dep1': function () {return 'this is dep1';},
      'dep2': function () {return 'this is dep2';},
      'dep3': function () {return 'this is dep3';},
      'dep4': function () {return 'this is dep4';}
    };

    var di = new DI(deps);

    var yes = di.inject( function(dep3, dep1, dep2) {
      return [dep1(), dep2(), dep3()].join(' -> ');
    });

    expect(yes()).to.equal('this is dep1 -> this is dep2 -> this is dep3');
  });
});
