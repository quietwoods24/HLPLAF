print("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
# Level 1: (11 % 4 = 3 task)
#     3. Write a program that takes two numbers from the user 
#        and prints their sum.

flag_n = True
num1 = input("Write first number : ")
if num1.isdigit():
    num1 = int(num1)
else:
    flag_n = False
    print("Input value is not a number")

num2 = input("Write second number: ")
if num2.isdigit():
    num2 = int(num2)
else:
    flag_n = False
    print("Input value is not a number")

if (flag_n):
    print("\nResult: ")
    print(f"{num1} + {num2} = {num1 + num2}")

print("\n")



print("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
# Level 2: (11 % 4 = 3 task)
#     3. Write a program that determines whether a number entered 
#        by the user is prime.

num = input("Write natural number: ")
if num.isdigit():
    num = int(num)
else:
    print("Input value is not a number")

flag = True
# https://geekflare.com/dev/prime-number-in-python/
if (num == 1):
    flag = False
else:
    for i in range(2, num):
        if (num % i) == 0:
            flag = False

    if (flag):
        print("Number IS prime")
    else:
        print("Number IS NOT prime")
print("\n")



print("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
# Level 3: (11 % 4 = 3 task)
#     3. Create a "Calculator" class with methods for addition, 
#        subtraction, multiplication, and division. Display the 
#        result of the calculation for a given example.

class Calculator:
  def add(self, num1, num2):
    return num1 + num2
  
  def sub(self, num1, num2):
    return num1 - num2
  
  def mult(self, num1, num2):
    return num1 * num2
  
  def div(self, num1, num2):
    if (num2 == 0):
        return "ERROR: division by 0"
    else:
        return num1 / num2

calc = Calculator()
# https://www.geeksforgeeks.org/python/gfact-50-python-end-parameter-in-print/
print("Write first number : ", end='')
num3 = int(input())
print("Write cecond number: ", end='')
num4 = int(input())
print("\n")

calc_add  = calc.add(num3, num4)
calc_sub  = calc.sub(num3, num4)
calc_mult = calc.mult(num3, num4)
calc_div  = calc.div(num3, num4)

print(f"{num3} + {num4} = {calc_add}")
print(f"{num3} - {num4} = {calc_sub}")
print(f"{num3} * {num4} = {calc_mult}")
print(f"{num3} / {num4} = {calc_div}")
print("\n")


print("=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-")
# Level 4: (11 % 4 = 3 task)
#     3. Create a "Library" class that allows you to add and remove books, 
#        as well as display a list of all books.

class Library:
    def __init__(self):
        self.storage = []

    def add(self, book):
        if (isinstance(book, Book)): 
            self.storage.append(book)
        else:
            print("ERROR: can't add, variable isn't Book type")

    def delete(self, book):
        if (isinstance(book, Book)):             
            # https://www.w3schools.com/python/python_try_except.asp
            try:
                # https://www.mygreatlearning.com/blog/remove-item-from-list-python/
                self.storage.remove(book)
            except:
                print(f"ERROR: Book '{book.title}' is not present in the library")
        else:
            print("ERROR: can't remove, variable isn't Book type")


    def print_l(self):
        if len(self.storage) == 0:
            print("ERROR: there is no books in storage")
        else:
            i = 1
            for b in self.storage:
                print(f"Book №{i}:")
                print(f"    Title : {b.title};")
                print(f"    Author: {b.author};")
                print(f"    Year  : {b.year};")
                print(f"    Genre : {b.genre};")
                print("---")
                i += 1
            


class Book:
    # To indicate that an attribute or method is non-public, 
    # you should follow the common Python convention of 
    # prefixing the attribute or method name with an 
    # underscore (_). 
    
    def __init__(self, t, a, y, g):
        self._title  = t
        self._author = a
        self._year  = y
        self._genre = g

    # https://www.geeksforgeeks.org/python/python-property-decorator-property/
    @property
    def title(self): 
        return self._title 

    @title.setter 
    def title(self, n): 
        if (isinstance(n, str)): 
            self._title = n 
        else:
           print("ERROR: book name must be string type")
    

    @property
    def author(self): 
        return self._author
    
    @author.setter 
    def author(self, a): 
        if (isinstance(a, str)): 
            self._author = a 
        else:
           print("ERROR: author name must be string type")
    

    @property
    def year(self): 
        return self._year 
    
    @year.setter 
    def year(self, y): 
        if str(y).isdigit(): 
            self._year = int(y)
        else:
           print("ERROR: year of writing the book must be a numeric type")

    
    @property
    def genre(self): 
        return self._genre 
    
    @genre.setter 
    def genre(self, g): 
        if (isinstance(g, str)): 
            self._genre = g 
        else:
           print("ERROR: book genre must be string type")


lib = Library()
b1 = Book("The Way to Amalthea", "Boris and Arkady Strugatsky", 1959, "Science fiction")
b2 = Book("Roadside Picnic", "Boris and Arkady Strugatsky", 1971, "Science fiction")
b3 = Book("Fahrenheit 451", "Ray Bradbury", 1953, "Dystopia")
b4 = "Book"

lib.add(b1)
lib.add(b2)
lib.add(b3)
lib.add(b4) # ERROR: can't add, variable isn't Book type

print("\n-=-=-=-=-=-\n")

lib.print_l()

print("\n-=-=-=-=-=-\n")

b3.title = "Monday Begins on Saturday"
b3.author = "Boris and Arkady Strugatsky"
b3.year  = 1965
b3.genre = 13 # ERROR: book genre must be string type
b3.genre = "Science fantasy"

print("\n-=-=-=-=-=-\n")

lib.print_l()

lib.delete(b3)

print("\n-=-=-=-=-=-\n")

lib.print_l()



