[![Build Status](https://travis-ci.org/syzer/mr-t.svg?branch=master)](https://travis-ci.org/syzer/mr-t)
[![npm version](https://badge.fury.io/js/mr-t.svg)](https://badge.fury.io/js/mr-t)

# MR-T

Cli tool that translates to english.

Helpful if you work with people using other languages.


![mr-t-image-ascii-version](https://raw.githubusercontent.com/syzer/mr-t/master/mr-t-ascii.jpg)


# Install

```bash
npm i -g mr-t
```

# Usage

1. type
```bash
>mt-t funktioniert ok
```
2. read output
```bash
>works ok
```
3. profit!


# Usage with streams:

```bash
echo "Sprache. Kultur" | mr-t
```
>Language culture


# test
```bash
npm test
```

# test2
```bash
mr-t "Simpego - App-Store - Schreibfehler - Diverse wäre korrekt"
``` 
>Simpego - App Store - Typo - Diverse would be correct
