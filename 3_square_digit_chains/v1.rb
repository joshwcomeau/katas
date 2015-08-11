### Project Euler 92, version 1

=begin
A number chain is created by continuously adding the square of the digits in a number to form a new number until it has been seen before.

For example,

44 → 32 → 13 → 10 → 1 → 1
85 → 89 → 145 → 42 → 20 → 4 → 16 → 37 → 58 → 89

Therefore any chain that arrives at 1 or 89 will become stuck in an endless loop. What is most amazing is that EVERY starting number will eventually arrive at 1 or 89.

How many starting numbers below ten million will arrive at 89?
=end


# Strategy 1: Brute force.
# Start at 10,000,000. Check to see if it ends up at 89. Move on to 9,999,999.
# Somehow, I suspect this will take forever, but I want to prove the concept.
# I think I'll start with 1,000 instead.

# Just because I can, I'm monkeypatching Array to be able to square all of its
# string values.
class Array
  def squared
    self.map { |n| n.to_i ** 2 }
  end
end

# First thing's first, we need a way of checking if N is an 89'er
def final_chain_num(n)
  # Convert it into an array of its digits. Man, I've missed ruby.
  split_digits = n.to_s.split('').squared.inject(:+)
end

puts final_chain_num(44)