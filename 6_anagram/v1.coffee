# Finds all possible anagrams of a given word/phrase.
# Uses a list of words from 12dicts: http://wordlist.aspell.net/12dicts/
fs = require 'fs'



module.exports = 
  # Uses the 'fs' module to open a locally-stored text file of newline-separated
  # words, returns an array of strings, one for each word in the dictionary.
  #  > PARAMETERS
  #    - filename     (string)
  #  > RETURNS
  #    [string]
  load_dictionary: (filename) ->
    words = fs.readFileSync filename, 'utf8'
    return words.split '\n'

  # Iterates through a given dictionary and returns an array of all words which
  # can be created with a supplied set of letters.
  #  > PARAMETERS
  #    - letters     (string)
  #    - dictionary  (array)
  #  > RETURNS
  #    [string] (a subset of 'dictionay')
  find_available_words: (parent_word, dictionary) ->
    self = @
    return dictionary.reduce (found_words, current_word) ->
      if self.word_contains_letters parent_word, current_word
        found_words.push current_word
      
      return found_words
    , []
    
  # Determines whether a given set of characters can be constructed with a given
  # set of letters.
  #  > PARAMETERS
  #    - word     (string)
  #    - letters  (string)
  #  > RETURNS
  #    boolean
  word_contains_letters: (word, letters) ->
    remaining_pool = word
    
    return letters.split('').every (letter) ->
      # If this letter isn't in our set of remaining letters,
      # it means this word does not contain this set of letters.
      if remaining_pool.indexOf(letter) == -1 then return false

      # Otherwise, it means we have a match and can continue.
      remaining_pool = remaining_pool.replace letter, ''
      return true
    
    
  solve: (letters, dictionary_filename) ->
    # Solution attempt 1:
    # Find all the dictionary words that can be made out of the supplied letters.
    # Then, see how many combinations can be made that use exactly all of the 
    # available letters once.
    dictionary = @load_dictionary dictionary_filename
    available_words = @find_available_words letters, dictionary

