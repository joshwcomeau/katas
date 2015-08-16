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



# Ahh, Ruby. The language where everything is an object, and everything can
# be fiddled with. For convenience, I've written a method on Array that will
# let me turn every array element into an array and square it.
# eg. ['1', '2', '3'] → [1, 4, 9]
class Array
  def squared
    self.map { |n| n.to_i ** 2 }
  end
end

# The first thing we need to do is figure out if number N is 'happy' or not.
# This method takes a number and always returns either 1 or 89, since all
# numbers will eventually reach one of these two options.
def final_chain_num(n)
  while n != 1 and n != 89
    # Remember what I said about Ruby being succinct? Yeah, this line does a
    # ton. It takes an integer, turns it into a string, splits all of its
    # digits into an array, runs my monkeypatched 'square' method on it,
    # and then sums all of its values together.
    n = n.to_s.split('').squared.inject(:+)
    # 'inject' is an absolutely lovely method, you may know it as 'reduce'.
  end

  return n
end

# Now that we have our calculation method done, we just need to go from 1 to n,
# running our method on every number and keeping track of
def countdown_from(max)
  unhappy_number_count = 0

  1.upto(max) do |i|
    # Pretty straightforward. 'upto' is an iterator that does what you'd think.
    # If the result is 89, we increment our counter.
    unhappy_number_count += 1 if final_chain_num(i) == 89
  end

  # Ruby has implicit returns
  unhappy_number_count
end

max = 10_000_000

# Ruby makes benchmarking super easy; we can just make a note of the time before
# the synchronous method, and afterwards. The difference is our execution time.
t1 = Time.now
solution = countdown_from max
t2 = Time.now

# Yay multi-line string interpolation!
puts """There are #{solution} unhappy numbers under #{max}.
Operation took #{t2-t1} seconds."""
# This solution finds the right answer, but it takes 278.410315 seconds.
