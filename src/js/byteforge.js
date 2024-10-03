document.addEventListener('DOMContentLoaded', () => {
    let centralArrayOfInt = new Uint8Array();

    const bcConsole = document.getElementById('bcConsole');
    bcConsole.value = '';

    let isUpdating = false;

    let endiannessFloat = document.getElementById('bcEndiannessFloat').value;
    let endiannessInt = document.getElementById('bcEndiannessInt').value;
    let stringSubstituteChar = document.getElementById('bcStringSubstituteChar').value;
    let byteArrayPrefix = document.getElementById('bcByteArrayPrefix').checked;
    let byteArraySpace = document.getElementById('bcByteArraySpace').checked;
    let byteArrayComma = document.getElementById('bcByteArrayComma').checked;
    const bcByteArrayLength = document.querySelectorAll('.bcByteArrayLength');
    const bcStringASCIILength = document.getElementById('bcStringASCIILength');
    const bcStringUTF8Length = document.getElementById('bcStringUTF8Length');

    const inputsConfig = [
        {
            element: document.getElementById('bcByteArrayHex'),
            parse: (val) => parseByteArrayHex(val),
            format: (val) => createByteArrayHex(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcByteArrayDec'),
            parse: (val) => parseByteArrayDec(val),
            format: (val) => createByteArrayDec(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcByteArrayOct'),
            parse: null,
            format: (val) => createByteArrayOct(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcByteArrayBin'),
            parse: null,
            format: (val) => createByteArrayBin(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcStringASCII'),
            parse: (val) => parseASCIIString(val),
            format: (val) => createASCIIString(val, stringSubstituteChar),
        },
        {
            element: document.getElementById('bcStringUTF8'),
            parse: null,
            format: (val) => createStringUTF8(val, stringSubstituteChar),
        },
        {
            element: document.getElementById('bcFloat32'),
            parse: (val) => parseFloat32(val, endiannessFloat),
            format: (val) => createFloat32(val, endiannessFloat),
        },
        {
            element: document.getElementById('bcFloat64'),
            parse: (val) => parseFloat64(val, endiannessFloat),
            format: (val) => createFloat64(val, endiannessFloat),
        },
        {
            element: document.getElementById('bcUint8'),
            parse: null,
            format: (val) => createInt8(val, 0),
        },
        {
            element: document.getElementById('bcUint16'),
            parse: null,
            format: (val) => createInt16(val, endiannessInt, 0),
        },
        {
            element: document.getElementById('bcUint32'),
            parse: null,
            format: (val) => createInt32(val, endiannessInt, 0),
        },
        {
            element: document.getElementById('bcUint64'),
            parse: null,
            format: (val) => createInt64(val, endiannessInt, 0),
        },
        {
            element: document.getElementById('bcInt8'),
            parse: null,
            format: (val) => createInt8(val, 1),
        },
        {
            element: document.getElementById('bcInt16'),
            parse: null,
            format: (val) => createInt16(val, endiannessInt, 1),
        },
        {
            element: document.getElementById('bcInt32'),
            parse: null,
            format: (val) => createInt32(val, endiannessInt, 1),
        },
        {
            element: document.getElementById('bcInt64'),
            parse: null,
            format: (val) => createInt64(val, endiannessInt, 1),
        }
    ];

    const bcEndiannessInt = document.getElementById('bcEndiannessInt');
    bcEndiannessInt.addEventListener('change', (event) => {
        endiannessInt = event.target.value;
        updateAllInputs(0);
    });

    const bcEndiannessFloat = document.getElementById('bcEndiannessFloat');
    bcEndiannessFloat.addEventListener('change', (event) => {
        endiannessFloat = event.target.value;
        updateAllInputs(0);
    });

    const bcStringSubstituteChar = document.getElementById('bcStringSubstituteChar');
    bcStringSubstituteChar.addEventListener('input', (event) => {
        stringSubstituteChar = event.target.value;
        updateAllInputs(0);
    });

    const bcByteArrayPrefix = document.getElementById('bcByteArrayPrefix');
    bcByteArrayPrefix.addEventListener('input', (event) => {
        byteArrayPrefix = event.target.checked;
        updateAllInputs(4);
    });

    const bcByteArraySpace = document.getElementById('bcByteArraySpace');
    bcByteArraySpace.addEventListener('input', (event) => {
        byteArraySpace = event.target.checked;
        updateAllInputs(4);
    });

    const bcByteArrayComma = document.getElementById('bcByteArrayComma');
    bcByteArrayComma.addEventListener('input', (event) => {
        byteArrayComma = event.target.checked;
        updateAllInputs(4);
    });

    inputsConfig.forEach((inputConfig, index) => {
        inputConfig.element.addEventListener('input', () => {
        if (isUpdating || !inputConfig.parse) return;
        const parsedValue = inputConfig.parse(inputConfig.element);
        if (!parsedValue.success) return;
        centralArrayOfInt = parsedValue.result;
        updateAllInputs(index);
        });
    });

    function updateAllInputs(excludeIndex) {
        isUpdating = true;
        bcConsole.value = '';
        inputsConfig.forEach((inputConfig, index) => {
            if (index === excludeIndex || !inputConfig.format) return;

            out = inputConfig.format(centralArrayOfInt);
            if (out.success) {
                inputConfig.element.value = out.result;
            } else {
                if (out.message)
                    bcConsole.value += out.message + '\n';
                inputConfig.element.value = '';
            }
        });

        bcByteArrayLength.forEach(span => {
            if (centralArrayOfInt.length <= 0) {
                span.innerHTML = "";
            } else if (centralArrayOfInt.length == 1) {
                span.innerHTML = `(${centralArrayOfInt.length} byte)`;
            } else {
                span.innerHTML = `(${centralArrayOfInt.length} bytes)`;
            }
        });

        isUpdating = false;
    }

    updateAllInputs(-1);

    function createByteArrayHex(input, prefix = false, space = false, comma = false) {
        const hexArray = [];
        for (let i = 0; i < input.length; i++) {
            hexArray.push(input[i].toString(16).padStart(2, '0').toUpperCase());
        }
        let formattedHex = hexArray;
        if (prefix) {
            formattedHex = formattedHex.map(byte => '0x' + byte);
        }
        let separator = '';
        if (comma && space) {
            separator = ', ';
        } else if (comma) {
            separator = ',';
        } else if (space) {
            separator = ' ';
        } else {
            separator = '';
        }
        return { success: true, result: formattedHex.join(separator) };
    }

    function parseByteArrayHex(input) {
        inputValue = input.value.replace(/0x/g, '')
                        .replace(/[\s,]+/g, '');
        if (inputValue.length === 0){
            input.style.color = '';
            return { success: true, result: new Uint8Array()};
        }
        if (inputValue.length % 2 !== 0) {
            input.style.color = 'red';
            return { success: false, message: 'Invalid hex string: length must be even' };
        }
        let result = new Array();
        for (let i = 0; i < inputValue.length; i += 2) {
            let charCode = parseInt(inputValue.substr(i, 2), 16);
            if (isNaN(charCode)) {
                input.style.color = 'red';
                return { success: false, message: 'Invalid hex character' };
            } else {
                input.style.color = '';
            }
            result.push(charCode);
        }
        return { success: true, result: new Uint8Array(result) };
    }

    function parseByteArrayDec(input) {
        const regex = /(?:^|[ ,])0*d*(\d+)(?=[ ,]|$)/g;
        let result = [];
        let match;
        while ((match = regex.exec(input)) !== null) {
            result.push(parseInt(match[1], 10));
        }
        return { success: true, result: new Uint8Array(result) };
    }

    function createByteArrayDec(input, prefix, space, comma) {
        let result = Array.from(input)
            .map(byte => {
                let decByte = byte.toString(10);
                if (prefix) {
                    decByte = '0d' + decByte;
                }
                return decByte;
            })
            .join(comma ? (space ? ', ' : ',') : (space ? ' ' : ''));
        return { success: true, result: result };
    }

    function createByteArrayOct(input, prefix, space, comma) {
        let result = Array.from(input)
            .map(byte => {
                let octalByte = byte.toString(8).padStart(3, '0');
                if (prefix) {
                    octalByte = '0o' + octalByte;
                }
                return octalByte;
            })
            .join(comma ? (space ? ', ' : ',') : (space ? ' ' : ''));
            return { success: true, result: result };
    }

    function createByteArrayBin(input, prefix, space, comma) {
        let result = Array.from(input)
        .map(byte => {
            let binaryByte = byte.toString(2).padStart(8, '0');
            if (prefix) {
                binaryByte = '0b' + binaryByte;
            }
            return binaryByte;
        })
        .join(comma ? (space ? ', ' : ',') : (space ? ' ' : ''));
        return { success: true, result: result };
    }

    function createASCIIString(input, substituteChar) {
        let result = Array.from(input).map(byte => {
            return (byte >= 32 && byte <= 126) ? String.fromCharCode(byte) : substituteChar;
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

    function createStringUTF8(input, substitute = '?') {
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

    function createFloat32(input, endianness) {
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

    function createFloat64(input, endianness) {
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

    function createInt8(input, sign) {
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

    function createInt16(input, endianness, sign) {
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

    function createInt32(input, endianness, sign) {
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

    function createInt64(input, endianness, sign) {
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
});
