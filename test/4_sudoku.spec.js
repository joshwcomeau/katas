var expect = require('chai').expect;

var validate = require('../4_sudoku_validator/final');

xdescribe('Sudoku Validator', function() {
  describe('invalid board', function() {
    it('fails on a board with duplicate numbers in the same row', function() {
      var board = [
        [5, 3, 4, 6, 7, 8, 9, 1, 1], // <-- two '1's in this row.
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 2], // <- two '2's in this one.
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ];
      
      expect( validate(board) ).to.equal(false);
    });
    
    it('fails on a board with duplicate numbers in the same column', function() {
      var board = [
        [5, 3, 4, 6, 7, 8, 9, 2, 1], // last column has two '1's
        [6, 7, 2, 1, 9, 5, 3, 4, 8], // penultimate column has two '2's
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1], 
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ];
      
      expect( validate(board) ).to.equal(false);
    });
    
    it('fails on a board with duplicate numbers in the same region', function() {
      var board = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2], // First region (top left) has two '4's.
        [6, 4, 2, 1, 9, 5, 3, 7, 8], 
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1], 
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 7, 5, 2, 8, 6, 1, 4, 9]
      ];
      
      expect( validate(board) ).to.equal(false);
    });
  });
  
  describe('valid board', function() {
    it('succeeds!', function() {
      var board = [
        [5, 3, 4, 6, 7, 8, 9, 1, 2], 
        [6, 7, 2, 1, 9, 5, 3, 4, 8],
        [1, 9, 8, 3, 4, 2, 5, 6, 7],
        [8, 5, 9, 7, 6, 1, 4, 2, 3],
        [4, 2, 6, 8, 5, 3, 7, 9, 1], 
        [7, 1, 3, 9, 2, 4, 8, 5, 6],
        [9, 6, 1, 5, 3, 7, 2, 8, 4],
        [2, 8, 7, 4, 1, 9, 6, 3, 5],
        [3, 4, 5, 2, 8, 6, 1, 7, 9]
      ];
      
      expect( validate(board) ).to.equal(true);
    });
  });
});