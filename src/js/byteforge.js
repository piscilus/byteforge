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
            format: (val) => composeByteArrayHex(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcByteArrayDec'),
            parse: (val) => parseByteArrayDec(val),
            format: (val) => composeByteArrayDec(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcByteArrayOct'),
            parse: (val) => parseByteArrayOct(val),
            format: (val) => composeByteArrayOct(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcByteArrayBin'),
            parse: (val) => parseByteArrayBin(val),
            format: (val) => composeByteArrayBin(val, byteArrayPrefix, byteArraySpace, byteArrayComma),
        },
        {
            element: document.getElementById('bcStringASCII'),
            parse: (val) => parseStringASCII(val),
            format: (val) => composeASCIIString(val, stringSubstituteChar),
        },
        {
            element: document.getElementById('bcStringUTF8'),
            parse: (val) => parseStringUTF8(val),
            format: (val) => composeStringUTF8(val, stringSubstituteChar),
        },
        {
            element: document.getElementById('bcFloat32'),
            parse: (val) => parseFloat32(val, endiannessFloat),
            format: (val) => composeFloat32(val, endiannessFloat),
        },
        {
            element: document.getElementById('bcFloat64'),
            parse: (val) => parseFloat64(val, endiannessFloat),
            format: (val) => composeFloat64(val, endiannessFloat),
        },
        {
            element: document.getElementById('bcUint8'),
            parse: (val) => parseInt8(val, false),
            format: (val) => composeInt8(val, 0),
        },
        {
            element: document.getElementById('bcUint16'),
            parse: (val) => parseInt16(val, endiannessInt, false),
            format: (val) => composeInt16(val, endiannessInt, false),
        },
        {
            element: document.getElementById('bcUint32'),
            parse: null,
            format: (val) => composeInt32(val, endiannessInt, false),
        },
        {
            element: document.getElementById('bcUint64'),
            parse: null,
            format: (val) => composeInt64(val, endiannessInt, false),
        },
        {
            element: document.getElementById('bcInt8'),
            parse: (val) => parseInt8(val, true),
            format: (val) => composeInt8(val, true),
        },
        {
            element: document.getElementById('bcInt16'),
            parse: (val) => parseInt16(val, endiannessInt, true),
            format: (val) => composeInt16(val, endiannessInt, true),
        },
        {
            element: document.getElementById('bcInt32'),
            parse: null,
            format: (val) => composeInt32(val, endiannessInt, true),
        },
        {
            element: document.getElementById('bcInt64'),
            parse: null,
            format: (val) => composeInt64(val, endiannessInt, true),
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
        if (!parsedValue.success) {
            inputConfig.element.style.color = 'red';
            if (parsedValue.message)
                bcConsole.value += parsedValue.message + '\n';
            return;
        }
        else {
            inputConfig.element.style.color = '';
        }
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
                // if (out.message)
                //    bcConsole.value += out.message + '\n';
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

});
