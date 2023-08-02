# Slur Redaction

## Exact slur matching
Exact slur matching works using regex and string matching. There is one common list of all slurs in the file `slur-replace.js`. This common list of slurs is also updated with new slurs and is in the variable `slurList`.

### Slurs not being matched by regex query
There are a few slurs that do not get matched with the regex query being used.

1. Some slurs get matched with they are space-separated but not if they are surrounded by other characters e.g. double-quotes. These slurs are kept in the `missedSlurListStatic` separate static variable for further regex matching .

2. If a slur contains a character that needs to be escaped, it is also not getting matched by regex even when escaping the character in the phrase. There is currently only one slur with this criteria. it is placed in the `missedEscapedSlurListStatic` variable for further matching as a simple string.