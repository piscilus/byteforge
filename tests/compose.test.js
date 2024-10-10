// compose.test.js

const { composeByteArrayHex, composeFloat64 } = require('../src/js/compose');

describe('composeByteArrayHex', () => {
    test('converts byte array to hex string without any formatting', () => {
        const input = new Uint8Array([0, 15, 255]);
        const output = composeByteArrayHex(input, false, false, '');
        expect(output).toEqual({ success: true, result: '000FFF' });
    });

    test('converts byte array to hex string with prefix', () => {
        const input = new Uint8Array([16, 32, 48]);
        const output = composeByteArrayHex(input, true, true, '');
        expect(output).toEqual({ success: true, result: '0x10 0x20 0x30' });
    });

    test('converts byte array to hex string with comma separation', () => {
        const input = new Uint8Array([1, 2, 3]);
        const output = composeByteArrayHex(input, false, false, ',');
        expect(output).toEqual({ success: true, result: '01,02,03' });
    });

    test('converts byte array to hex string with comma and space separation', () => {
        const input = new Uint8Array([10, 20, 30]);
        const output = composeByteArrayHex(input, false, true, ',');
        expect(output).toEqual({ success: true, result: '0A, 14, 1E' });
    });

    test('handles empty input array', () => {
        const input = new Uint8Array();
        const output = composeByteArrayHex(input, false, false, '');
        expect(output).toEqual({ success: true, result: '' });
    });

    test('handles single byte input without formatting', () => {
        const input = new Uint8Array([255]);
        const output = composeByteArrayHex(input, false, false, '');
        expect(output).toEqual({ success: true, result: 'FF' });
    });

    test('handles prefix, space, and comma all together', () => {
        const input = new Uint8Array([5, 10, 15]);
        const output = composeByteArrayHex(input, true, true, ',');
        expect(output).toEqual({ success: true, result: '0x05, 0x0A, 0x0F' });
    });

    test('defaults to no separator when options are false', () => {
        const input = new Uint8Array([1, 2, 3]);
        const output = composeByteArrayHex(input);
        expect(output).toEqual({ success: true, result: '010203' });
    });

    test('throws error when input is not an array', () => {
        const input = "not an array";
        expect(() => composeByteArrayHex(input, false, false, '')).toThrow(TypeError);
    });

    test('throws error when input is not an array', () => {
        const input = new Array([1,2,3]);
        expect(() => composeByteArrayHex(input, false, false, '')).toThrow(TypeError);
    });

});

describe('composeFloat64', () => {
    test('expect a 1 for big endian', () => {
        const input = new Uint8Array([0x3F, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: '1' });
    });
    test('expect a 1 for little endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x3F]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: '1' });
    });
    test('expect a 0 for big endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: '0' });
    });
    test('expect a 0 for little endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: '0' });
    });
    test('expect a 0 for big endian', () => {
        const input = new Uint8Array([0x80, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: '-0' });
    });
    test('expect a 0 for little endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x80]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: '-0' });
    });
    test('expect a NaN for big endian', () => {
        const input = new Uint8Array([0x7F, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: 'NaN' });
    });
    test('expect a NaN for little endian', () => {
        const input = new Uint8Array([0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x7F]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: 'NaN' });
    });
    test('expect a 5 for big endian', () => {
        const input = new Uint8Array([0x40, 0x14, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: '5' });
    });
    test('expect a 5 for little endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x14, 0x40]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: '5' });
    });
    test('expect a inf for big endian', () => {
        const input = new Uint8Array([0x7F, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: '∞' });
    });
    test('expect a inf for little endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x7F]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: '∞' });
    });
    test('expect a inf for big endian', () => {
        const input = new Uint8Array([0xFF, 0xF0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]);
        const output = composeFloat64(input, 'big');
        expect(output).toEqual({ success: true, result: '-∞' });
    });
    test('expect a inf for little endian', () => {
        const input = new Uint8Array([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0xFF]);
        const output = composeFloat64(input, 'little');
        expect(output).toEqual({ success: true, result: '-∞' });
    });

});