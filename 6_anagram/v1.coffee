# Finds all possible anagrams of a given word/phrase.
# Uses a list of words from 12dicts: http://wordlist.aspell.net/12dicts/
require 'fs'

DICTIONARY = 'sample_words.txt' # '2of4brif.txt'

load_dictionary = (filename) ->
  words = fs.readFileSync filename, 'utf8'
  return words.split '\n'