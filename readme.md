# Simple JS/Node utility for sorting tables on Wikipedia

## Usage

Run the .js through Node like so:

```
node wikitable-text-sort.js <inputFile> <sortByColumn>
```

Where `<inputFile>` is a `.txt` file containing a WikiText-formatted table, and `<sortByColumn>` is an integer for what column to sort by.

## Example input file

```
{| class="wikitable"
|-
! Header 1
! Header 2
! Header 3
|-
| row 1, cell 1
| row 1, cell 2
| row 1, cell 3
|-
| row 2, cell 1
| row 2, cell 2
| row 2, cell 3
|}
```

## Disclaimer

**This script is __extremely__ simple and might not work on complicated tables**