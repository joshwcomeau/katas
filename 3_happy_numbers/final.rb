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


# Here's the magical new method!
def sum_squares_of_digit(n)
  ans = 0

  while n > 0
    # Ok, this is a little complex, but bear with me.

    # The modulo (%) symbol returns the remainder of division. For example,
    # 4 / 2 leaves no remainder, so 4 % 2 is 0.
    # 5 / 2, however, returns 2.5. Therefore, 5 % 2 is 5.
    # Dividing any number by 10 will return a remainder of the last integer.
    # 1234 / 10 = 123.4. The remainder, then, is 4.
    # Using this technique, we can easily find the last 'character' of an int.
    ans += (n % 10) ** 2

    # After we've found the final number and added it's squared value to our
    # total, we divide n by 10. For example, after determining that 1234's first
    # digit is '16', we divide by 10 to make our number 123.4
    # In ruby, if you divide an integer, it ignores remainders. You would need
    # to convert to float first if you cared about it. So 1234 / 10 == 123.
    # we then repeat the above process. 123 % 10 == 3, 3² == 9, 16 + 9 == 25.
    # We continue doing this until we get to 1 / 10, which resolves to 0.
    # At this point our 'while' loop fails and we return the answer!
    n /= 10
  end
  
  ans
end

# The rest of this is unchanged from version 3.
def final_chain_num(n)
  while n != 1 and n != 89
    n = sum_squares_of_digit(n)
  end
  n
end

def create_lookup_table(max)
  # This is my new array-based lookup table.

  # For simplicity, I'm prepending the table with nil.
  # This is so that the number '1' is in index 1, not 0. The number 2 is in
  # index 2, etc. Much cleaner than needing to subtract 1 for lookup.
  lookup_table = [ nil ]

  1.upto(max) do |n|
    lookup_table[n] = final_chain_num(n) == 89
  end

  lookup_table
end

def solve(max)
  lookup_table = create_lookup_table 567
  num_of_89s = 0

  1.upto(max) do |n|
    squared_digits = sum_squares_of_digit(n)
    num_of_89s += 1 if lookup_table[squared_digits]
  end

  num_of_89s
end


max = 10_000_000

t1 = Time.now
solution = solve max
t2 = Time.now

puts """There are #{solution} unhappy numbers under #{max}.
Operation took #{t2-t1} seconds."""
# Takes 6.146798 seconds to solve 10_000_000.
