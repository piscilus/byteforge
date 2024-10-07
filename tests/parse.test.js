const { parseByteArrayHex, parseByteArrayDec, parseByteArrayOct, parseByteArrayBin } = require('../src/js/parse');

describe('parseByteArrayHex', () => {
    let mockInput;

    beforeEach(() => {
        mockInput = {
            value: '',
            style: {
                color: ''
            }
        };
    });

    test('parses valid hex string with different formats  and returns correct Uint8Array', () => {
        mockInput.value = "0x080A00,6,B FF";
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([8, 10, 0, 6, 11, 255]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses valid hex string and returns correct Uint8Array', () => {
        mockInput.value = "0x01 0xFF 0xA5";
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 255, 165]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns empty Uint8Array for empty input', () => {
        mockInput.value = '';
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
        expect(mockInput.style.color).toBe('');
    });

    test('parses single hex value of odd-length correctly', () => {
        mockInput.value = '0x1';
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "0" hex string', () => {
        mockInput.value = '0';
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "A" hex string', () => {
        mockInput.value = 'A';
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([10]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for invalid hex character', () => {
        mockInput.value = '0x1G';
        const output = parseByteArrayHex(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('parses hex string with commas and spaces correctly', () => {
        mockInput.value = '0xA0, 0xB1, 0xC2';
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([160, 177, 194]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses hex string without separator correctly', () => {
        mockInput.value = 'DEADBEEFC0FFEE';
        const output = parseByteArrayHex(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([222, 173, 190, 239, 192, 255, 238]) });
        expect(mockInput.style.color).toBe('');
    });

});

describe('parseByteArrayDec', () => {
    let mockInput;

    beforeEach(() => {
        mockInput = {
            value: '',
            style: {
                color: ''
            }
        };
    });

    test('parses valid dec string with different formats  and returns correct Uint8Array', () => {
        mockInput.value = "0d8 009001,6,255 123";
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([8, 9, 1, 6, 255, 123]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses valid dec string and returns correct Uint8Array', () => {
        mockInput.value = '0d01 0d255 0d165';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 255, 165]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns empty Uint8Array for empty input', () => {
        mockInput.value = '';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for odd-length dec string', () => {
        mockInput.value = '0d1';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "0" dec string', () => {
        mockInput.value = '0';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "0" dec string', () => {
        mockInput.value = '255';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for invalid dec value', () => {
        mockInput.value = '256';
        const output = parseByteArrayDec(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('returns error for invalid dec character', () => {
        mockInput.value = '0d1A';
        const output = parseByteArrayDec(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('parses dec string with commas and spaces correctly', () => {
        mockInput.value = '0d42, 0d69, 0d01';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([42, 69, 1]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses dec string without separator correctly', () => {
        mockInput.value = '123255007042123';
        const output = parseByteArrayDec(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([123, 255, 7, 42, 123]) });
        expect(mockInput.style.color).toBe('');
    });

});

describe('parseByteArrayOct', () => {
    let mockInput;

    beforeEach(() => {
        mockInput = {
            value: '',
            style: {
                color: ''
            }
        };
    });

    test('parses valid oct string with different formats and returns correct Uint8Array', () => {
        mockInput.value = "0o7 005001,6,377 123";
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([7, 5, 1, 6, 255, 83]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses valid oct string and returns correct Uint8Array', () => {
        mockInput.value = '0o01 0o300 0o55';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 192, 45]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns empty Uint8Array for empty input', () => {
        mockInput.value = '';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for odd-length oct string', () => {
        mockInput.value = '0o1';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "0" oct string', () => {
        mockInput.value = '0';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "255" oct string', () => {
        mockInput.value = '377';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for invalid oct value', () => {
        mockInput.value = '378';
        const output = parseByteArrayOct(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('returns error for invalid oct character', () => {
        mockInput.value = '0o1A';
        const output = parseByteArrayOct(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('returns error for invalid oct character', () => {
        mockInput.value = '0o9';
        const output = parseByteArrayOct(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('parses oct string with commas and spaces correctly', () => {
        mockInput.value = '0o42, 0o67, 0o01';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([34, 55, 1]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses oct string without separator correctly', () => {
        mockInput.value = '123255007042123';
        const output = parseByteArrayOct(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([83, 173, 7, 34, 83]) });
        expect(mockInput.style.color).toBe('');
    });

});


describe('parseByteArrayBin', () => {
    let mockInput;

    beforeEach(() => {
        mockInput = {
            value: '',
            style: {
                color: ''
            }
        };
    });

    test('parses valid bin string with different formats and returns correct Uint8Array', () => {
        mockInput.value = "0b101 0100111000110011,1,11111111 110";
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([5, 78, 51, 1, 255, 6]) });
        expect(mockInput.style.color).toBe('');
    });

    test('parses valid bin string and returns correct Uint8Array', () => {
        mockInput.value = '0b00000001 0b11000000 0b101101';
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1, 192, 45]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns empty Uint8Array for empty input', () => {
        mockInput.value = '';
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array() });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for odd-length bin string', () => {
        mockInput.value = '0b1';
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([1]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "0" bin string', () => {
        mockInput.value = '0';
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([0]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for "11111111" bin string', () => {
        mockInput.value = '11111111';
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([255]) });
        expect(mockInput.style.color).toBe('');
    });

    test('returns error for invalid bin character', () => {
        mockInput.value = '0b12';
        const output = parseByteArrayBin(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('returns error for invalid bin character', () => {
        mockInput.value = '0bA';
        const output = parseByteArrayBin(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('returns error for invalid bin character', () => {
        mockInput.value = 'o';
        const output = parseByteArrayBin(mockInput);
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('parses oct string without separator correctly', () => {
        mockInput.value = '0101001110101101000001110010001001010011';
        const output = parseByteArrayBin(mockInput);
        expect(output).toEqual({ success: true, result: new Uint8Array([83, 173, 7, 34, 83]) });
        expect(mockInput.style.color).toBe('');
    });

});
