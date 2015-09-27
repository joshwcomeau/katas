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
  #    - dictionary  ([string])
  #  > RETURNS
  #    [string] (a subset of 'dictionay')
  find_available_words: (letters, dictionary) ->
    self = @
    return dictionary.reduce (found_words, current_word) ->
      if self.word_contains_letters letters, current_word
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
    
    
  # Take the difference of two sets of strings. For example, when given
  # 'boom' and 'ob', return 'om'.
  #  > PARAMETERS
  #    - word     (string)
  #    - letters  (string)
  #  > RETURNS
  #    [string]
  remove_word_from_letters: (word, letters) ->
    remainder = word
    
    letters.split('').forEach (letter) ->
      remainder = remainder.replace(letter, '')
    
    return remainder
    
  # When given our original set of letters, and a bunch of words that can be
  # made from those letters, return all valid anagrams.
  #  > PARAMETERS
  #    - letters          (string)
  #    - available_words  ([string])
  #  > RETURNS
  #    [string]
  find_valid_anagrams: (letters, available_words) ->
    # This is tricky. Example:
    # LETTERS: Racecar
    # WORDS:   'race', 'car', 'care', 'arc', 'arr'
    # We can pick the first word, 'race', in which case we're left with 'car'.
    # Then, we need to figure out if 'car' can be anagrammed any further.
    # 'race car' is one solution, but so is 'race arc'
    self = @
    valid_anagrams = []
    
    available_words.forEach (word) ->
      word_remainder = self.remove_word_from_letters word, letters
    
  solve: (letters, dictionary_filename) ->
    # Solution attempt 1:
    # Find all the dictionary words that can be made out of the supplied letters.
    # Then, see how many combinations can be made that use exactly all of the 
    # available letters once.
    dictionary = @load_dictionary dictionary_filename
    available_words = @find_available_words letters, dictionary
    
    return @find_valid_anagrams letters, available_words

