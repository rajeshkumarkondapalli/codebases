import difflib

with open('file1.txt') as f1, open('file2.txt') as f2:
    text1 = f1.read()
    text2 = f2.read()

    matcher = difflib.SequenceMatcher(None, text1, text2)
    for tag, i1, i2, j1, j2 in matcher.get_opcodes():
        if tag == 'replace':
            print(f"Replaced '{text1[i1:i2]}' with '{text2[j1:j2]}'")
        elif tag == 'delete':
            print(f"Deleted '{text1[i1:i2]}'")
        elif tag == 'insert':
            print(f"Inserted '{text2[j1:j2]}'")
        elif tag == 'equal':
            print(f"Unchanged: '{text1[i1:i2]}'")






