expect = require('chai').expect

anagram = require '../6_anagram/v1'

describe 'Anagram', ->  
  describe 'find_available_words', ->
    dictionary = ['alpine', 'ladygaga', 'mart', 'tram', 'harro']
    letters    = 'parliament'
    words      = []
    
    before ->
      words = anagram.find_available_words letters, dictionary
    
    it 'returns an array', ->
      expect( words ).to.be.an 'array'
    
    it 'finds 3 words out of 5 that are contained in `parliament`', ->
      expect( words.length ).to.equal 3
    
    it 'finds the first word, `alpine`', ->
      expect( words[0] ).to.equal 'alpine'
    
    it 'finds the second word, `mart`', ->
      expect( words[1] ).to.equal 'mart'
    
    it 'finds the third word, `tram`', ->
      expect( words[2] ).to.equal 'tram'


  describe 'remove_word_from_letters', ->
    it 'succeeds when one is a superset', ->
      expect( anagram.remove_word_from_letters('carman', 'car') ).to.equal 'man'
    
    it 'succeeds when the order is scrambled', ->
      expect( anagram.remove_word_from_letters('tracks', 'src') ).to.equal 'tak'

    it 'does not remove duplicates', ->
      expect( anagram.remove_word_from_letters('boom', 'ob') ).to.equal 'om'
  
    it 'does remove duplicates when specified', ->
      expect( anagram.remove_word_from_letters('aaaah', 'aaa') ).to.equal 'ah'
  
  
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
