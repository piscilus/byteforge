function composeByteArrayHex(input, prefix = false, space = false, sepChar = '') {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    let result = Array.from(input)
        .map(byte => {
            let hexByte = byte.toString(16).padStart(2, '0').toUpperCase();
            if (prefix) {
                hexByte = '0x' + hexByte;
            }
            return hexByte;
        })
        .join(sepChar ? (space ? sepChar + ' ' : sepChar) : (space ? ' ' : ''));
    return { success: true, result: result };
}

function composeByteArrayDec(input, prefix, space, sepChar = '') {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    let result = Array.from(input)
        .map(byte => {
            let decByte = byte.toString(10);
            if (prefix) {
                decByte = '0d' + decByte;
            }
            return decByte;
        })
        .join(sepChar ? (space ? sepChar + ' ' : sepChar) : (space ? ' ' : ''));
    return { success: true, result: result };
}

function composeByteArrayOct(input, prefix, space, sepChar = '') {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    let result = Array.from(input)
        .map(byte => {
            let octalByte = byte.toString(8).padStart(3, '0');
            if (prefix) {
                octalByte = '0o' + octalByte;
            }
            return octalByte;
        })
        .join(sepChar ? (space ? sepChar + ' ' : sepChar) : (space ? ' ' : ''));
    return { success: true, result: result };
}

function composeByteArrayBin(input, prefix, space, sepChar = '') {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    let result = Array.from(input)
        .map(byte => {
            let binaryByte = byte.toString(2).padStart(8, '0');
            if (prefix) {
                binaryByte = '0b' + binaryByte;
            }
            return binaryByte;
        })
        .join(sepChar ? (space ? sepChar + ' ' : sepChar) : (space ? ' ' : ''));
    return { success: true, result: result };
}

function composeASCIIString(input, substituteEnable = false, substituteChar = '?') {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    let result = Array.from(input)
        .map(byte => {
            if (substituteEnable) {
                return (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : substituteChar;
            } else {
                return String.fromCharCode(byte);
            }
        }).join('');
    if (result.length <= 0) {
        bcStringASCIILength.innerHTML = "";
    } else if (result.length == 1) {
        bcStringASCIILength.innerHTML = `(${result.length} character)`;
    } else {
        bcStringASCIILength.innerHTML = `(${result.length} characters)`;
    }
    return { success: true, result: result };
}

function composeStringUTF8(input, substituteEnable = false, substituteChar = '?') {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    const decoder = new TextDecoder('utf-8');
    const utf8string = decoder.decode(input);
    let result = utf8string;//.replace(/[^\x20-\x7E]/g, substitute);
    if (result.length <= 0) {
        bcStringUTF8Length.innerHTML = "";
    } else if (result.length == 1) {
        bcStringUTF8Length.innerHTML = `(${result.length} character)`;
    } else {
        bcStringUTF8Length.innerHTML = `(${result.length} characters)`;
    }
    return { success: true, result: result };
}

function composeFloat32(input, endianness) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    if (input.length % 4 !== 0) {
        return { success: false, message: 'Insufficient data to calculate 32-bit float!' };
    }
    let result = [];
    let buffer = new ArrayBuffer(4);
    let view = new DataView(buffer);
    for (let i = 0; i < input.length; i += 4) {
        for (let j = 0; j < 4; j++) {
            view.setUint8(j, input[i + j]);
        }
        let float64Value = view.getFloat32(0, endianness === 'little');
        result.push(float64Value);
    }
    return { success: true, result: result.join('\n') };
}

function composeFloat64(input, endianness) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    if (input.length % 8 !== 0) {
        return { success: false, message: 'Insufficient data to calculate 64-bit float!' };
    }
    let result = [];
    let buffer = new ArrayBuffer(8);
    let view = new DataView(buffer);
    for (let i = 0; i < input.length; i += 8) {
        for (let j = 0; j < 8; j++) {
            view.setUint8(j, input[i + j]);
        }
        let float64Value = view.getFloat64(0, endianness === 'little');
        result.push(float64Value);
    }
    return { success: true, result: result.join('\n') };
}

function composeInt8(input, sign) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    let result = [];
    for (let i = 0; i < input.length; i++) {
        let value = input[i];
        if (sign) {
            if (value > 0x7F) {
                value = value - 0x100;
            }
        }
        result.push(value);
    }
    return { success: true, result: result.join('\n') };
}

function composeInt16(input, endianness, sign) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    if (input.length % 2 !== 0) {
        return { success: false, message: 'Insufficient data to calculate 16-bit integer!' };
    }
    let result = [];
    for (let i = 0; i < input.length; i += 2) {
        let value;
        if (endianness === 'little') {
            value = (input[i + 1] << 8) | input[i + 0];
        } else {
            value = (input[i + 0] << 8) | input[i + 1];
        }
        if (sign) {
            if (value > 0x7FFF) {
                value = value - 0x10000;
            }
        }
        result.push(value);
    }
    return { success: true, result: result.join('\n') };
}

function composeInt32(input, endianness, sign) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    if (input.length % 4 !== 0) {
        return { success: false, message: 'Insufficient data to calculate 32-bit  integer!' };
    }
    let result = [];
    for (let i = 0; i < input.length; i += 4) {
        let value;
        if (endianness === 'little') {
            value = (input[i + 3] << 24) | (input[i + 2] << 16) | (input[i + 1] << 8) | input[i + 0];
        } else {
            value = (input[i + 0] << 24) | (input[i + 1] << 16) | (input[i + 2] << 8) | input[i + 3];
        }
        if (sign) {
            if (value > 0x7FFFFFFF) {
                value = value - 0x100000000;
            }
        }
        else {
            value = value >>> 0;
        }
        result.push(value);
    }
    return { success: true, result: result.join('\n') };
}

function composeInt64(input, endianness, sign) {
    if (!(input instanceof Uint8Array)) {
        throw new TypeError("Input must be a Uint8Array.");
    }
    if (input.length % 8 !== 0) {
        return { success: false, message: 'Insufficient data to calculate 64-bit integer!' };
    }
    let result = [];
    for (let i = 0; i < input.length; i += 8) {
        let value = BigInt(0);
        if (endianness === 'little') {
            value = (BigInt(input[i + 7]) << 56n) | (BigInt(input[i + 6]) << 48n) |
                    (BigInt(input[i + 5]) << 40n) | (BigInt(input[i + 4]) << 32n) |
                    (BigInt(input[i + 3]) << 24n) | (BigInt(input[i + 2]) << 16n) |
                    (BigInt(input[i + 1]) << 8n)  | BigInt(input[i + 0]);
        } else {
            value = (BigInt(input[i + 0]) << 56n) | (BigInt(input[i + 1]) << 48n) |
                    (BigInt(input[i + 2]) << 40n) | (BigInt(input[i + 3]) << 32n) |
                    (BigInt(input[i + 4]) << 24n) | (BigInt(input[i + 5]) << 16n) |
                    (BigInt(input[i + 6]) << 8n)  | BigInt(input[i + 7]);
        }
        if (sign) {
            if (value > 0x7FFFFFFFFFFFFFFFn) {
                value = value - 0x10000000000000000n;
            }
        }
        result.push(value.toString());
    }
    return { success: true, result: result.join('\n') };
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        composeASCIIString,
        composeByteArrayBin,
        composeByteArrayDec,
        composeByteArrayHex,
        composeByteArrayOct,
        composeFloat32,
        composeFloat64,
        composeInt16,
        composeInt32,
        composeInt64,
        composeInt8
    };
}
