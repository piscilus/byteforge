function parseByteArrayHex(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    try {
        const splitRegex = /(?:0x|,|;|\s)+/i;
        const tokens = input.value.split(splitRegex).filter(token => token.length > 0);
        const result = [];
        const hexRegex = /^[0-9a-fA-F]+$/;
        for (const token of tokens) {
            if (!hexRegex.test(token)) {
                throw new Error(`ByteArrayHex: Invalid non-hexadecimal characters in token '${token}'!`);
            }
            if (token.length === 1 || token.length === 2) {
                const byte = parseInt(token, 16);
                result.push(byte);
            } else {
                if (token.length % 2 !== 0) {
                    throw new Error(`ByteArrayHex: Invalid concatenated hex string in token "${token}" (must have even number of digits, e.g. BEEF)!`);
                }
                for (let i = 0; i < token.length; i += 2) {
                    const byteStr = token.slice(i, i + 2);
                    const byte = parseInt(byteStr, 16);
                    result.push(byte);
                }
            }
        }
        return { success: true, result: new Uint8Array(result) };
    } catch (error) {
        return { success: false, message: error.message};
    }
}

function parseByteArrayDec(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    try {
        const splitRegex = /(?:0d|,|;|\s)+/i;
        const tokens = input.value.split(splitRegex).filter(token => token.length > 0);
        const result = [];
        const decRegex = /^[0-9]+$/;
        for (const token of tokens) {
            if (!decRegex.test(token)) {
                throw new Error(`ByteArrayDec: Invalid non-decimal characters in token '${token}'!`);
            }
            if (token.length === 1 || token.length === 2 || token.length === 3) {
                const byte = parseInt(token, 10);
                if (byte > 255) {
                    throw new Error(`ByteArrayDec: Decimal segment must be 0..255. '${token}'!`);
                }
                result.push(byte);
            } else {
                if (token.length % 3 !== 0) {
                    throw new Error(`ByteArrayDec: Invalid concatenated dec string in token "${token}" (must have a multiple of 3 digits, e.g. 042)!`);
                }
                for (let i = 0; i < token.length; i += 3) {
                    const byteStr = token.slice(i, i + 3);
                    const byte = parseInt(byteStr, 10);
                    if (byte > 255) {
                        throw new Error(`ByteArrayDec: Decimal segment must be 0..255. '${token}'!`);
                    }
                    result.push(byte);
                }
            }
        }
        return { success: true, result: new Uint8Array(result) };
    } catch (error) {
        return { success: false, message: error.message};
    }
}

function parseByteArrayOct(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    try {
        const splitRegex = /(?:0o|,|;|\s)+/i;
        const tokens = input.value.split(splitRegex).filter(token => token.length > 0);
        const result = [];
        const octRegex = /^[0-7]+$/;
        for (const token of tokens) {
            if (!octRegex.test(token)) {
                throw new Error(`ByteArrayOct: Invalid non-octal characters in token '${token}'!`);
            }
            if (token.length === 1 || token.length === 2 || token.length === 3) {
                const byte = parseInt(token, 8);
                if (byte > 255) {
                    throw new Error(`ByteArrayOct: Octal segment must be 0..377. '${token}'!`);
                }
                result.push(byte);
            } else {
                if (token.length % 3 !== 0) {
                    throw new Error(`ByteArrayOct: Invalid concatenated oct string in token "${token}" (must have a multiple of 3 digits, e.g. 042)!`);
                }
                for (let i = 0; i < token.length; i += 3) {
                    const byteStr = token.slice(i, i + 3);
                    const byte = parseInt(byteStr, 8);
                    if (byte > 255) {
                        throw new Error(`ByteArrayOct: Octal segment must be 0..377. '${token}'!`);
                    }
                    result.push(byte);
                }
            }
        }
        return { success: true, result: new Uint8Array(result) };
    } catch (error) {
        return { success: false, message: error.message};
    }
}

function parseByteArrayBin(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    try {
        const splitRegex = /(?:0b|,|;|\s)+/i;
        const tokens = input.value.split(splitRegex).filter(token => token.length > 0);
        const result = [];
        const binRegex = /^[0-1]+$/;
        for (const token of tokens) {
            if (!binRegex.test(token)) {
                throw new Error(`ByteArrayBin: Invalid non-binary characters in token '${token}'!`);
            }
            if (token.length >= 1 && token.length <= 8) {
                const byte = parseInt(token, 2);
                result.push(byte);
            } else {
                if (token.length % 8 !== 0) {
                    return { success: false, message: `Invalid concatenated bin string (must have a multiple of 8 digits): "${token}"`};
                    throw new Error(`ByteArrayBin: Invalid concatenated bin string in token "${token}" (must have a multiple of 8 digits, e.g. 1011001101011010)!`);
                }
                for (let i = 0; i < token.length; i += 8) {
                    const byteStr = token.slice(i, i + 8);
                    const byte = parseInt(byteStr, 2);
                    result.push(byte);
                }
            }
        }
        return { success: true, result: new Uint8Array(result) };
    } catch (error) {
        return { success: false, message: error.message};
    }
}

function parseStringASCII(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }
    try {
        let result = new Array();
        for (let i = 0; i < input.value.length; i++) {
            let charCode = input.value.charCodeAt(i);
            if (charCode < 32 || charCode > 126) {
                throw new Error(`StringASCII: Invalid non-ASCII character '${input.value[i]}'!`);
            }
            result.push(charCode);
        }
        return { success: true, result: new Uint8Array(result) };
    } catch (error) {
        return { success: false, message: error.message};
    }
}

function parseStringUTF8(input) {
    if (typeof input.value !== 'string') {
        throw new TypeError('Input must be a string!');
    }

    const utf8String = input.value.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    ).replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );

    let result = new Array();
    for (let i = 0; i < utf8String.length; i++) {
        let charCode = utf8String.charCodeAt(i);
        result.push(charCode);
    }
    return { success: true, result: new Uint8Array(result) };
}

function parseFloat32(input, endianness) {
    let floatArray;
    try {
        floatArray = input.value.trim().split('\n').map(line => {
            if (!/^-?\d+([.,]\d+)?([eE]-?\d+)?$/.test(line.trim())) {
                throw new Error(`Invalid float value: '${line}'`);
            }
            let parsed = parseFloat(line.replace(',', '.'));
            return parsed;
        });
    } catch (error) {
        input.style.color = 'red';
        return { success: false, message: `Invalid float input: '${error.message}'`};
    }
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    let byteArray = [];
    for (let i = 0; i < floatArray.length; i++) {
        view.setFloat32(0, floatArray[i], endianness === 'little');
        for (let j = 0; j < 4; j++) {
            byteArray.push(view.getUint8(j));
        }
    }
    input.style.color = '';
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

function parseInt8(input, sign) {
    let result;
    try {
        let values = input.value.trim().split('\n').map(line => {
            let trimmedLine = line.trim();
            if (sign) {
                if (!/^-?\d+$/.test(trimmedLine)) {
                    throw new Error(`Int8: '${trimmedLine}' is not a valid signed number!`);
                }
            } else {
                if (!/^\d+$/.test(trimmedLine)) {
                    throw new Error(`Uint8: '${trimmedLine}' is not a valid unsigned number!`);
                }
            }
            let number = parseInt(trimmedLine, 10);
            if (sign) {
                if (number < -128 || number > 127) {
                    throw new Error(`Int8: '${trimmedLine}' is out of range (-128 to 127) for signed 8-bit integers!`);
                }
            } else {
                if (number < 0 || number > 255) {
                    throw new Error(`Uint8: '${trimmedLine}' is out of range (0 to 255) for unsigned 8-bit integers!`);
                }
            }
            return number;
        });
        result = new Uint8Array(values);
    } catch (error) {
        return { success: false, message: error.message};
    }
    return { success: true, result: new Uint8Array(result) };
}

function parseInt16(input, endianness, sign) {
    try {
        let result = input.value.trim().split('\n').map(line => {
            let trimmedLine = line.trim();
            if (sign) {
                if (!/^-?\d+$/.test(trimmedLine)) {
                    throw new Error(`Int16: '${trimmedLine}' is not a valid signed number!`);
                }
            } else {
                if (!/^\d+$/.test(trimmedLine)) {
                    throw new Error(`Uint16: '${trimmedLine}' is not a valid unsigned number!`);
                }
            }
            let number = parseInt(trimmedLine, 10);
            if (sign) {
                if (number < -32768 || number > 32767) {
                    throw new Error(`Int16: '${trimmedLine}' is out of range (-32768 to 32767) for signed 16-bit integers!`);
                }
            } else {
                if (number < 0 || number > 65535) {
                    throw new Error(`Uint16: '${trimmedLine}' is out of range (0 to 65535) for unsigned 16-bit integers!`);
                }
            }
            let lowByte = number & 0xFF;
            let highByte = (number >> 8) & 0xFF;
            if (endianness === "little") {
                return [lowByte, highByte];
            } else {
                return [highByte, lowByte];
            }
        });
        return { success: true, result: new Uint8Array(result.flat()) };
    } catch (error) {
        return { success: false, message: error.message};
    }

}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        parseStringASCII,
        parseStringUTF8,
        parseByteArrayBin,
        parseByteArrayDec,
        parseByteArrayHex,
        parseByteArrayOct,
        parseFloat32,
        parseFloat64,
        parseInt8,
        parseInt16
    };
}
