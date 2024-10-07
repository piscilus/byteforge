const { parseByteArrayHex, parseByteArrayDec } = require('../src/js/parse');

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

    test('parses valid hex string and returns correct Uint8Array', () => {
        mockInput.value = '0x01 0xFF 0xA5';
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
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
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
        expect(output.success).toEqual(false);
        expect(mockInput.style.color).toBe('red');
    });

    test('returns error for "0" dec string', () => {
        mockInput.value = '0';
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
