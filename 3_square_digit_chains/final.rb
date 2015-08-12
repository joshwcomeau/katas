### Project Euler 92, version 2

=begin
A number chain is created by continuously adding the square of the digits in a number to form a new number until it has been seen before.

For example,

44 → 32 → 13 → 10 → 1 → 1
85 → 89 → 145 → 42 → 20 → 4 → 16 → 37 → 58 → 89

Therefore any chain that arrives at 1 or 89 will become stuck in an endless loop. What is most amazing is that EVERY starting number will eventually arrive at 1 or 89.

How many starting numbers below ten million will arrive at 89?
=end


# Strategy 4: Array lookup + better number calculations.
# It turns out the major bottleneck is doing the
# integer-to-string-to-array-to-integer conversions. There's a much better way,
# that I thought of early on, but ignored because I liked how easy-to-understand
# and succinct my current method is -_-.


def create_lookup_table(max)
  # We're pre-loading our array with nil, so that the 1st 'real' entry has index 0
  lookup_table = [ nil ]

  1.upto(max) do |n|
    lookup_table[n] = final_chain_num(n) == 89
  end

  lookup_table
end


def sum_squares_of_digit(n)
  ans = 0

  while n > 0
    ans += (n % 10) ** 2
    n /= 10
  end
  ans
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
  num_of_89s = 0

  1.upto(max) do |n|
    squared_digits = sum_squares_of_digit(n)
    num_of_89s += 1 if lookup_table[squared_digits]
  end

  num_of_89s
end


max = 10_000_000

t1 = Time.now
puts "there are #{solve(max)} 89s below #{max}"
t2 = Time.now


puts "Operation took #{t2-t1} seconds."
# Takes 6.146798 seconds to solve 10_000_000.
