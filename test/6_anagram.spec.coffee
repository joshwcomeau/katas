expect = require('chai').expect

anagram = require '../6_anagram/v1'

describe 'Anagram', ->  
  describe 'word_contains_letters', ->
    context 'succeeds when it', ->
      it 'is a superset of the letters', ->
        expect( anagram.word_contains_letters('racecar', 'car') ).to.equal true
    
      it 'is identical to the letters', ->
        expect( anagram.word_contains_letters('hi', 'hi') ).to.equal true
    
      it 'is scrambled', ->
        expect( anagram.word_contains_letters('rate', 'tear') ).to.equal true
    
      it 'contains multiples of the same letter', ->
        expect( anagram.word_contains_letters('aaaaa', 'aaa') ).to.equal true
    
    context 'fails when it', ->
      it 'has an additional word not found', ->
        expect( anagram.word_contains_letters('boo', 'oboe') ).to.equal false
      
      it 'has a single letter not found', ->
        expect( anagram.word_contains_letters('racecar', 'g') ).to.equal false
      
      it 'has duplicates not found', ->
        expect( anagram.word_contains_letters('apple', 'ppp') ).to.equal false
      
      it 'has special characters', ->
        expect( anagram.word_contains_letters('hi', 'hi!') ).to.equal false


  describe 'solve', ->
    DICTIONARY = './6_anagram/sample_words.txt'

    it 'successfully finds all combinations', ->
      solutions = anagram.solve 'parliament', DICTIONARY
      
      solutions.should.equal []
