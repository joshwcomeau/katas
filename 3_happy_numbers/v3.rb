### Project Euler 92, version 2

=begin
A number chain is created by continuously adding the square of the digits in a number to form a new number until it has been seen before.

For example,

44 → 32 → 13 → 10 → 1 → 1
85 → 89 → 145 → 42 → 20 → 4 → 16 → 37 → 58 → 89

Therefore any chain that arrives at 1 or 89 will become stuck in an endless loop. What is most amazing is that EVERY starting number will eventually arrive at 1 or 89.

How many starting numbers below ten million will arrive at 89?
=end


# Strategy 3: Array lookup.
# Similar to V2, but instead of a hash I'll use an array. My hope is that
# an array-lookup is a much simpler operation than a hash-lookup.


class Array
  def squared
    self.map { |n| n.to_i ** 2 }
  end
end


def create_lookup_table(max)
  # We're pre-loading our array with nil, so that the 1st 'real' entry has index 0
  lookup_table = [ nil ]

  1.upto(max) do |n|
    lookup_table[n] = final_chain_num(n) == 89
  end

  lookup_table
end

def sum_squares_of_digit(n)
  n.to_s.split('').squared.inject(:+)
end

def final_chain_num(n)
  while n != 1 and n != 89
    n = sum_squares_of_digit(n)
  end

  n
end

def solve(max)
  # First, let's find the max we'll need for our lookup table
  lookup_table = create_lookup_table 570
  unhappy_number_count = 0

  1.upto(max) do |n|
    squared_digits = sum_squares_of_digit(n)
    unhappy_number_count += 1 if lookup_table[squared_digits]
  end

  unhappy_number_count
end

max = 10_000_000

t1 = Time.now
puts "there are #{solve(max)} 89s below #{max}"
t2 = Time.now

puts "Operation took #{t2-t1} seconds."
# Takes 63.350606 seconds to solve 10_000_000.
