import difflib

with open('file1.txt') as f1, open('file2.txt') as f2:
    diff = difflib.unified_diff(f1.readlines(), f2.readlines(), fromfile='file1.txt', tofile='file2.txt')

    for line in diff:
        print(line, end='') 
