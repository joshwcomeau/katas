### Project Euler 92, version 2

=begin
A number chain is created by continuously adding the square of the digits in a number to form a new number until it has been seen before.

For example,

44 → 32 → 13 → 10 → 1 → 1
85 → 89 → 145 → 42 → 20 → 4 → 16 → 37 → 58 → 89

Therefore any chain that arrives at 1 or 89 will become stuck in an endless loop. What is most amazing is that EVERY starting number will eventually arrive at 1 or 89.

How many starting numbers below ten million will arrive at 89?
=end


# Strategy 2: Hash lookup
# The numbers get much smaller as the starting gets bigger. The largest number
# we're tasked with calculating is 9_999_999, which leads to a second-step number
# of 567. Therefore, all we REALLY need to know is whether the numbers from 1 to
# 567 resolve to 89 or not. Once we have that 'lookup table', we can just check
# the first result.


class Array
  def squared
    self.map { |n| n.to_i ** 2 }
  end
end


# I abstracted a single iteration of the happiness calculation into its own
# method, since I won't need to loop through all iterations for most numbers.
def sum_squares_of_digit(n)
  n.to_s.split('').squared.inject(:+)
end

def final_chain_num(n)
  while n != 1 and n != 89
    n = sum_squares_of_digit(n)
  end

  n
end

# First new piece: The lookup table. This is essentially our solution from V1,
# except instead of just counting the number of unhappy numbers, it stores
# their unhappiness as a boolean in a hash.
# The format of this hash looks like this:
#  {
#    1: false
#    2: true
#    3: true
#  }
def create_lookup_table(max)
  lookup_table = {}

  1.upto(max) do |n|
    lookup_table[n] = final_chain_num(n) == 89
  end

  lookup_table
end

def solve(max)
  # We generate our hash lookup table with a fixed maximum value
  # (if I wanted to be really proper, I could calculate the max needed for the
  # lookup based on the 'max' provided, but it's unnecessary for this problem)
  lookup_table = create_lookup_table 567
  unhappy_number_count = 0

  1.upto(max) do |n|
    # Similar to before, except now we're just performing 1 iteration of the
    # squaring-and-summing, and then looking up the resulting value in our hash.
    squared_digits = sum_squares_of_digit(n)
    unhappy_number_count += 1 if lookup_table[squared_digits]
  end

  unhappy_number_count
end

max = 10_000_000

t1 = Time.now
solution = solve max
t2 = Time.now

puts """There are #{solution} unhappy numbers under #{max}.
Operation took #{t2-t1} seconds."""
# This solution finds the right answer, but it takes 64.079941 seconds.
