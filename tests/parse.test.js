const {
    parseByteArrayHex,
    parseByteArrayDec,
    parseByteArrayOct,
    parseByteArrayBin,
    parseInt8,
    parseInt16,
    parseInt32,
    parseInt64,
    parseFloat64
} = require('../src/js/parse');

describe('parseByteArrayHex', () => {
    let value;

    test('parses valid hex string with different formats  and returns correct Uint8Array', () => {
        value = "0x080A00,6,B FF";
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([8, 10, 0, 6, 11, 255]) });
    });

    test('parses valid hex string and returns correct Uint8Array', () => {
        value = "0x01 0xFF 0xA5";
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 255, 165]) });
    });

    test('returns empty Uint8Array for empty input', () => {
        value = '';
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
    });

    test('parses single hex value of odd-length correctly', () => {
        value = '0x1';
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
    });

    test('returns error for "0" hex string', () => {
        value = '0';
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
    });

    test('returns error for "A" hex string', () => {
        value = 'A';
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([10]) });
    });

    test('returns error for invalid hex character', () => {
        value = '0x1G';
        const output = parseByteArrayHex(value);
        expect(output.success).toEqual(false);
    });

    test('parses hex string with commas and spaces correctly', () => {
        value = '0xA0, 0xB1, 0xC2';
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([160, 177, 194]) });
    });

    test('parses hex string without separator correctly', () => {
        value = 'DEADBEEFC0FFEE';
        const output = parseByteArrayHex(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([222, 173, 190, 239, 192, 255, 238]) });
    });

});

describe('parseByteArrayDec', () => {
    let value;

    test('parses valid dec string with different formats  and returns correct Uint8Array', () => {
        value = "0d8 009001,6,255 123";
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([8, 9, 1, 6, 255, 123]) });
    });

    test('parses valid dec string and returns correct Uint8Array', () => {
        value = '0d01 0d255 0d165';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 255, 165]) });
    });

    test('returns empty Uint8Array for empty input', () => {
        value = '';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
    });

    test('returns error for odd-length dec string', () => {
        value = '0d1';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
    });

    test('returns error for "0" dec string', () => {
        value = '0';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
    });

    test('returns error for "0" dec string', () => {
        value = '255';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
    });

    test('returns error for invalid dec value', () => {
        value = '256';
        const output = parseByteArrayDec(value);
        expect(output.success).toEqual(false);
    });

    test('returns error for invalid dec character', () => {
        value = '0d1A';
        const output = parseByteArrayDec(value);
        expect(output.success).toEqual(false);
    });

    test('parses dec string with commas and spaces correctly', () => {
        value = '0d42, 0d69, 0d01';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([42, 69, 1]) });
    });

    test('parses dec string without separator correctly', () => {
        value = '123255007042123';
        const output = parseByteArrayDec(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([123, 255, 7, 42, 123]) });
    });

});

describe('parseByteArrayOct', () => {
    let value;

    test('parses valid oct string with different formats and returns correct Uint8Array', () => {
        value = "0o7 005001,6,377 123";
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([7, 5, 1, 6, 255, 83]) });
    });

    test('parses valid oct string and returns correct Uint8Array', () => {
        value = '0o01 0o300 0o55';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 192, 45]) });
    });

    test('returns empty Uint8Array for empty input', () => {
        value = '';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
    });

    test('returns error for odd-length oct string', () => {
        value = '0o1';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
    });

    test('returns error for "0" oct string', () => {
        value = '0';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
    });

    test('returns error for "255" oct string', () => {
        value = '377';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
    });

    test('returns error for invalid oct value', () => {
        value = '378';
        const output = parseByteArrayOct(value);
        expect(output.success).toEqual(false);
    });

    test('returns error for invalid oct character', () => {
        value = '0o1A';
        const output = parseByteArrayOct(value);
        expect(output.success).toEqual(false);
    });

    test('returns error for invalid oct character', () => {
        value = '0o9';
        const output = parseByteArrayOct(value);
        expect(output.success).toEqual(false);
    });

    test('parses oct string with commas and spaces correctly', () => {
        value = '0o42, 0o67, 0o01';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([34, 55, 1]) });
    });

    test('parses oct string without separator correctly', () => {
        value = '123255007042123';
        const output = parseByteArrayOct(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([83, 173, 7, 34, 83]) });
    });

});


describe('parseByteArrayBin', () => {
    let value;

    test('parses valid bin string with different formats and returns correct Uint8Array', () => {
        value = "0b101 0100111000110011,1,11111111 110";
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([5, 78, 51, 1, 255, 6]) });
    });

    test('parses valid bin string and returns correct Uint8Array', () => {
        value = '0b00000001 0b11000000 0b101101';
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 192, 45]) });
    });

    test('returns empty Uint8Array for empty input', () => {
        value = '';
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
    });

    test('returns error for odd-length bin string', () => {
        value = '0b1';
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
    });

    test('returns error for "0" bin string', () => {
        value = '0';
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
    });

    test('returns error for "11111111" bin string', () => {
        value = '11111111';
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
    });

    test('returns error for invalid bin character', () => {
        value = '0b12';
        const output = parseByteArrayBin(value);
        expect(output.success).toEqual(false);
    });

    test('returns error for invalid bin character', () => {
        value = '0bA';
        const output = parseByteArrayBin(value);
        expect(output.success).toEqual(false);
    });

    test('returns error for invalid bin character', () => {
        value = 'o';
        const output = parseByteArrayBin(value);
        expect(output.success).toEqual(false);
    });

    test('parses oct string without separator correctly', () => {
        value = '0101001110101101000001110010001001010011';
        const output = parseByteArrayBin(value);
        expect(output).toEqual({ success: true, result: new Uint8Array([83, 173, 7, 34, 83]) });
    });

});


describe('parseInt8', () => {
    let value;

    test('parses valid two int8 values and returns correct Uint8Array', () => {
        value = "23\n34";
        const output = parseInt8(value, false);
        expect(output).toEqual({ success: true, result: new Uint8Array([23, 34]) });
    });

    test('parses valid uint8 max value and returns correct Uint8Array', () => {
        value = "255";
        const output = parseInt8(value, false);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
    });

    test('parses invalid uint8 max value +1 and returns error', () => {
        value = "256";
        const output = parseInt8(value, false);
        expect(output.success).toEqual(false);
    });

    test('parses valid uint8 min value and returns correct Uint8Array', () => {
        value = "0";
        const output = parseInt8(value, false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
    });

    test('parses invalid uint8 value "-1" and returns error', () => {
        value = "-1";
        const output = parseInt8(value, false);
        expect(output.success).toEqual(false);
    });

    test('parses valid int8 max value and returns correct Uint8Array', () => {
        value = "127";
        const output = parseInt8(value, true);
        expect(output).toEqual({ success: true, result: new Uint8Array([127]) });
    });

    test('parses invalid int8 max value +1 and returns error', () => {
        value = "128";
        const output = parseInt8(value, true);
        expect(output.success).toEqual(false);
    });

    test('parses valid int8 min value and returns correct Uint8Array', () => {
        value = "-128";
        const output = parseInt8(value, true);
        expect(output).toEqual({ success: true, result: new Uint8Array([-128]) });
    });

    test('parses invalid int8 max value -1 and returns error', () => {
        value = "-129";
        const output = parseInt8(value, true);
        expect(output.success).toEqual(false);
    });

});

describe('parseInt16', () => {
    let value;

    test('parses valid two int16 values and returns correct Uint8Array', () => {
        value = "1230\n35243";
        const output = parseInt16(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x04, 0xCE, 0x89, 0xAB]) });
    });

    test('parses valid two int16 values and returns correct Uint8Array', () => {
        value = "1230\n35243";
        const output = parseInt16(value, 'little', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0xCE, 0x04, 0xAB, 0x89]) });
    });

    test('parses valid uint16 max value and returns correct Uint8Array', () => {
        value = "65535";
        const output = parseInt16(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0xFF, 0xFF]) });
    });

    test('parses invalid uint16 max value +1 and returns error', () => {
        value = "65536";
        const output = parseInt16(value, 'big', false);
        expect(output.success).toEqual(false);
    });

    test('parses valid uint16 min value and returns correct Uint8Array', () => {
        value = "0";
        const output = parseInt16(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00]) });
    });

    test('parses invalid uint16 value "-1" and returns error', () => {
        value = "-1";
        const output = parseInt16(value, 'big', false);
        expect(output.success).toEqual(false);
    });

    test('parses valid int16 max value and returns correct Uint8Array', () => {
        value = "32767";
        const output = parseInt16(value, 'big', true);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x7F, 0xFF]) });
    });

    test('parses invalid int16 max value +1 and returns error', () => {
        value = "32768";
        const output = parseInt16(value, 'big', true);
        expect(output.success).toEqual(false);
    });

    test('parses valid int16 min value and returns correct Uint8Array', () => {
        value = "-32768";
        const output = parseInt16(value, 'big', true);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x80, 0x00]) });
    });

    test('parses invalid int16 max value -1 and returns error', () => {
        value = "-32769";
        const output = parseInt16(value, 'big', true);
        expect(output.success).toEqual(false);
    });

});

describe('parseInt32', () => {
    let value;

    test('parses valid two uint32 values and returns correct Uint8Array', () => {
        value = "4343534\n987964321";
        const output = parseInt32(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x42, 0x46, 0xEE, 0x3A, 0xE3, 0x23, 0xA1]) });
    });

    test('parses valid two uint32 values and returns correct Uint8Array', () => {
        value = "4343534\n987964321";
        const output = parseInt32(value, 'little', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0xEE, 0x46, 0x42, 0x00, 0xA1, 0x23, 0xE3, 0x3A]) });
    });

    test('parses valid uint32 max value and returns correct Uint8Array', () => {
        value = "4294967295";
        const output = parseInt32(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF]) });
    });

    test('parses invalid uint32 max value +1 and returns error', () => {
        value = "4294967296";
        const output = parseInt32(value, 'big', false);
        expect(output.success).toEqual(false);
    });

    test('parses valid uint32 min value and returns correct Uint8Array', () => {
        value = "0";
        const output = parseInt32(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00]) });
    });

    test('parses invalid uint32 value "-1" and returns error', () => {
        value = "-1";
        const output = parseInt32(value, 'big', false);
        expect(output.success).toEqual(false);
    });

    test('parses valid int32 max value and returns correct Uint8Array', () => {
        value = "2147483647";
        const output = parseInt32(value, 'big', true);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x7F, 0xFF, 0xFF, 0xFF]) });
    });

    test('parses invalid int32 max value +1 and returns error', () => {
        value = "2147483648";
        const output = parseInt32(value, 'big', true);
        expect(output.success).toEqual(false);
    });

    test('parses valid int32 min value and returns correct Uint8Array', () => {
        value = "-2147483648";
        const output = parseInt32(value, 'big', true);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x80, 0x00, 0x00, 0x00]) });
    });

    test('parses invalid int32 max value -1 and returns error', () => {
        value = "-2147483649";
        const output = parseInt32(value, 'big', true);
        expect(output.success).toEqual(false);
    });

});

describe('parseInt64', () => {
    let value;

    test('parses valid two uint64 values and returns correct Uint8Array', () => {
        value = "98796432154645334\n1443980976286412";
        const output = parseInt64(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x01, 0x5E, 0xFE, 0xD4, 0xE3, 0xA7, 0x53, 0x56, 0x00, 0x05, 0x21, 0x4B, 0x05, 0x27, 0x6A, 0xCC]) });
    });

    test('parses valid two uint64 values and returns correct Uint8Array', () => {
        value = "98796432154645334\n1443980976286412";
        const output = parseInt64(value, 'little', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x56, 0x53, 0xA7, 0xE3, 0xD4, 0xFE, 0x5E, 0x01, 0xCC, 0x6A, 0x27, 0x05, 0x4B, 0x21, 0x05, 0x00]) });
    });

    test('parses valid uint64 max value and returns correct Uint8Array', () => {
        value = "18446744073709551615";
        const output = parseInt64(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]) });
    });

    test('parses invalid uint64 max value +1 and returns error', () => {
        value = "18446744073709551616";
        const output = parseInt64(value, 'big', false);
        expect(output.success).toEqual(false);
    });

    test('parses valid uint64 min value and returns correct Uint8Array', () => {
        value = "0";
        const output = parseInt64(value, 'big', false);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });

    test('parses invalid uint64 value "-1" and returns error', () => {
        value = "-1";
        const output = parseInt64(value, 'big', false);
        expect(output.success).toEqual(false);
    });

    test('parses valid int64 max value and returns correct Uint8Array', () => {
        value = "9223372036854775807";
        const output = parseInt64(value, 'big', true);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x7F, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0xFF]) });
    });

    test('parses invalid int64 max value +1 and returns error', () => {
        value = "9223372036854775808";
        const output = parseInt64(value, 'big', true);
        expect(output.success).toEqual(false);
    });

    test('parses valid int64 min value and returns correct Uint8Array', () => {
        value = "-9223372036854775808";
        const output = parseInt64(value, 'big', true);
        expect(output).toEqual({ success: true, result: new Uint8Array([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });

    test('parses invalid int64 max value -1 and returns error', () => {
        value = "-9223372036854775809";
        const output = parseInt64(value, 'big', true);
        expect(output.success).toEqual(false);
    });

});

describe('parseFloat64', () => {
    let value;

    test('parses valid number 1.0 for big endian', () => {
        value = '1.0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x3F, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 0 for big endian', () => {
        value = '0.0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 0 for big endian', () => {
        value = '+0.0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 0 for big endian', () => {
        value = '0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 0 for big endian', () => {
        value = '+0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 0 for big endian', () => {
        value = '-0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 0 for big endian', () => {
        value = '-0.0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 23 for big endian', () => {
        value = '23.0';
        const output = parseFloat64(value, 'big');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x40, 0x37, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]) });
    });
    test('parses valid number 23 for little endian', () => {
        value = '23.0';
        const output = parseFloat64(value, 'little');
        expect(output).toEqual({ success: true, result: new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x37, 0x40]) });
    });
});
