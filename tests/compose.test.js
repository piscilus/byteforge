// compose.test.js

const { composeByteArrayHex } = require('../src/js/compose');

describe('composeByteArrayHex', () => {
    test('converts byte array to hex string without any formatting', () => {
        const input = new Uint8Array([0, 15, 255]);
        const output = composeByteArrayHex(input, false, false, false);
        expect(output).toEqual({ success: true, result: '000FFF' });
    });

    test('converts byte array to hex string with prefix', () => {
        const input = new Uint8Array([16, 32, 48]);
        const output = composeByteArrayHex(input, true, true, false);
        expect(output).toEqual({ success: true, result: '0x10 0x20 0x30' });
    });

    test('converts byte array to hex string with comma separation', () => {
        const input = new Uint8Array([1, 2, 3]);
        const output = composeByteArrayHex(input, false, false, true);
        expect(output).toEqual({ success: true, result: '01,02,03' });
    });

    test('converts byte array to hex string with comma and space separation', () => {
        const input = new Uint8Array([10, 20, 30]);
        const output = composeByteArrayHex(input, false, true, true);
        expect(output).toEqual({ success: true, result: '0A, 14, 1E' });
    });

    test('handles empty input array', () => {
        const input = new Uint8Array();
        const output = composeByteArrayHex(input, false, false, false);
        expect(output).toEqual({ success: true, result: '' });
    });

    test('handles single byte input without formatting', () => {
        const input = new Uint8Array([255]);
        const output = composeByteArrayHex(input, false, false, false);
        expect(output).toEqual({ success: true, result: 'FF' });
    });

    test('handles prefix, space, and comma all together', () => {
        const input = new Uint8Array([5, 10, 15]);
        const output = composeByteArrayHex(input, true, true, true);
        expect(output).toEqual({ success: true, result: '0x05, 0x0A, 0x0F' });
    });

    test('defaults to no separator when options are false', () => {
        const input = new Uint8Array([1, 2, 3]);
        const output = composeByteArrayHex(input);
        expect(output).toEqual({ success: true, result: '010203' });
    });

    test('throws error when input is not an array', () => {
        const input = "not an array";
        expect(() => composeByteArrayHex(input, false, false, false)).toThrow(TypeError);
    });

    test('throws error when input is not an array', () => {
        const input = new Array([1,2,3]);
        expect(() => composeByteArrayHex(input, false, false, false)).toThrow(TypeError);
    });

});
