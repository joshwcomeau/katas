# Finds all possible anagrams of a given word/phrase.
# Uses a list of words from 12dicts: http://wordlist.aspell.net/12dicts/
fs = require 'fs'

DICTIONARY = 'sample_words.txt' # '2of4brif.txt'

load_dictionary = (filename) ->
  words = fs.readFileSync filename, 'utf8'
  return words.split '\n'

word_to_solve = 'parliament'

find_available_words = (letters, dictionary) ->
  return dictionary.reduce (found_words, current_word) ->
    if word_contains_letters current_word, letters
      found_words.push current_word
    
    return found_words
  
  
module.exports = 
  solve: (letters, dictionary_filename) ->
    # Solution attempt 1:
    # Find all the dictionary words that can be made out of the supplied letters.
    # Then, see how many combinations can be made that use exactly all of the 
    # available letters once.
    dictionary = load_dictionary dictionary_filename
    available_words = find_available_words letters, dictionary

