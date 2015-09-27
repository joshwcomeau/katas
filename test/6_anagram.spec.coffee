expect = require('chai').expect

anagram = require '../6_anagram/v1'

describe 'Anagram', ->
  DICTIONARY = './6_anagram/sample_words.txt'
  
  it 'successfully finds all combinations', ->
    solutions = anagram.solve 'parliament', DICTIONARY
    
    solutions.should.equal []
