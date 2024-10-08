# Byte Forge

The **Byte Forge** is a web-based tool to convert between different byte array
formats and data types.

[![CI](https://github.com/piscilus/byteforge/actions/workflows/ci.yml/badge.svg)](https://github.com/piscilus/byteforge/actions/workflows/ci.yml)
![GitHub License](https://img.shields.io/github/license/piscilus/byteforge)

## To do

- [ ] max length for the form elements?
- [x] add missing conversion
- [ ] testing...
- byte array formats
  - [x] select semicolon or comma as a separator?
  - [ ] let user freely choose/type prefix and separator, e.g., up to three
        characters each?
- [ ] endianness for byte array (swap)
- [ ] error messages / logging
- [ ] final layout (HTML/CSS)
  - [ ] dark mode
- [ ] noscript HTML tag
- [ ] floats: select decimal separator , vs. .
- [ ] help
  - [ ] general help / concept
  - [ ] integrated information for all formats

## Known issues

- [x] When there was an invalid input and the style is changed to red, it does
      not get reset when input from a different format is written to the
      element, i.e., the compose functions must reset the style.
- [ ] Parsing high 64-bit numbers does not work properly
