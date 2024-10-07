function parseByteArrayHex(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    const splitRegex = /(?:0x|,|\s)+/i;
    const tokens = input.value.split(splitRegex).filter(token => token.length > 0);
    const result = [];
    const hexRegex = /^[0-9a-fA-F]+$/;
    for (const token of tokens) {
        if (!hexRegex.test(token)) {
            input.style.color = 'red';
            return { success: false, message: `Invalid hex characters in token: "${token}"`};
        }
        if (token.length === 1 || token.length === 2) {
            const byte = parseInt(token, 16);
            result.push(byte);
        } else {
            if (token.length % 2 !== 0) {
                input.style.color = 'red';
                return { success: false, message: `Invalid concatenated hex string (must have even number of digits): "${token}"`};
            }
            for (let i = 0; i < token.length; i += 2) {
                const byteStr = token.slice(i, i + 2);
                const byte = parseInt(byteStr, 16);
                result.push(byte);
            }
        }
    }
    input.style.color = '';
    return { success: true, result: new Uint8Array(result) };
}

function parseByteArrayDec(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    const splitRegex = /(?:0d|,|\s)+/i;
    const tokens = input.value.split(splitRegex).filter(token => token.length > 0);
    const result = [];
    const decRegex = /^[0-9]+$/;
    for (const token of tokens) {
        if (!decRegex.test(token)) {
            input.style.color = 'red';
            return { success: false, message: `Invalid dec characters in token: "${token}"`};
        }
        if (token.length === 1 || token.length === 2 || token.length === 3) {
            const byte = parseInt(token, 10);
            if (byte > 255) {
                input.style.color = 'red';
                return { success: false, message: `Decimal segment must be 0..255: "${token}"`};
            }
            result.push(byte);
        } else {
            if (token.length % 3 !== 0) {
                input.style.color = 'red';
                return { success: false, message: `Invalid concatenated dec string (must have a multiple of 3 digits): "${token}"`};
            }
            for (let i = 0; i < token.length; i += 3) {
                const byteStr = token.slice(i, i + 3);
                const byte = parseInt(byteStr, 10);
                if (byte > 255) {
                    input.style.color = 'red';
                    return { success: false, message: `Decimal segment must be 0..255: "${token}"`};
                }
                result.push(byte);
            }
        }
    }
    input.style.color = '';
    return { success: true, result: new Uint8Array(result) };
}

function parseByteArrayOct(input) {
    let inputValue = input.value.replace(/0o/g, '').trim();
    if (inputValue.length === 0) {
        input.style.color = '';
        return { success: true, result: new Uint8Array() };
    }
    let result = [];
    if (inputValue.includes(' ') || inputValue.includes(',')) {
        let segments = inputValue.split(/[\s,]+/);
        for (let segment of segments) {
            if (!/^[0-7]+$/.test(segment)) {
                input.style.color = 'red';
                return { success: false, message: 'Invalid input: only octal digits (0-7) are allowed' };
            }
            let byteValue = parseInt(segment, 8);
            if (byteValue > 255) {
                input.style.color = 'red';
                return { success: false, message: 'Invalid octal value: must not exceed 255' };
            }
            result.push(byteValue);
        }
    } else {
        if (!/^[0-7]+$/.test(inputValue)) {
            input.style.color = 'red';
            return { success: false, message: 'Invalid input: only octal digits (0-7) are allowed' };
        }
        for (let i = 0; i < inputValue.length; i += 3) {
            let octalStr = inputValue.substr(i, Math.min(3, inputValue.length - i));
            let byteValue = parseInt(octalStr, 8);
            if (byteValue > 255) {
                input.style.color = 'red';
                return { success: false, message: 'Invalid octal value: must not exceed 255' };
            }
            result.push(byteValue);
        }
    }
    input.style.color = '';
    return { success: true, result: new Uint8Array(result) };
}

function parseByteArrayBin(input) {
    let inputValue = input.value.replace(/0b/g, '')
                        .replace(/[\s,]+/g, '');

    if (inputValue.length === 0) {
        input.style.color = '';
        return { success: true, result: new Uint8Array() };
    }

    if (!/^[01]+$/.test(inputValue)) {
        input.style.color = 'red';
        return { success: false, message: 'Invalid input: only binary digits (0 or 1) are allowed' };
    }

    if (inputValue.length % 8 !== 0) {
        input.style.color = 'red';
        return { success: false, message: 'Invalid binary string: length must be a multiple of 8' };
    }

    let result = [];
    for (let i = 0; i < inputValue.length; i += 8) {
        let byteStr = inputValue.substr(i, 8);
        let byteValue = parseInt(byteStr, 2);

        if (isNaN(byteValue)) {
            input.style.color = 'red';
            return { success: false, message: 'Invalid binary character' };
        } else {
            input.style.color = '';
        }

        result.push(byteValue);
    }

    return { success: true, result: new Uint8Array(result) };
}

function parseASCIIString(input) {
    let result = new Array();
    for (let i = 0; i < input.value.length; i++) {
        let charCode = input.value.charCodeAt(i);
        if (charCode < 32 || charCode > 126) {
            input.style.color = 'red';
            return { success: false, message: 'Invalid hex input' };
        } else {
            input.style.color = '';
        }
        result.push(charCode);
    }
    return { success: true, result: new Uint8Array(result) };
}

function parseFloat32(input, endianness) {
    let floatArray = input.value.trim().split('\n').map(line => parseFloat(line));

    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    let byteArray = [];
    for (let i = 0; i < floatArray.length; i++) {
        view.setFloat32(0, floatArray[i], endianness === 'little');
        for (let j = 0; j < 4; j++) {
            byteArray.push(view.getUint8(j));
        }
    }
    return { success: true, result: new Uint8Array(byteArray) };
}

function parseFloat64(input, endianness) {
    let floatArray = input.value.trim().split('\n').map(line => parseFloat(line));
    let buffer = new ArrayBuffer(8);
    let view = new DataView(buffer);
    let byteArray = [];
    for (let i = 0; i < floatArray.length; i++) {
        view.setFloat64(0, floatArray[i], endianness === 'little');
        for (let j = 0; j < 8; j++) {
            byteArray.push(view.getUint8(j));
        }
    }
    return { success: true, result: new Uint8Array(byteArray) };
}

// Export the function for testing and external use
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        parseASCIIString,
        parseByteArrayBin,
        parseByteArrayDec,
        parseByteArrayHex,
        parseByteArrayOct,
        parseFloat32,
        parseFloat64
    };
}
