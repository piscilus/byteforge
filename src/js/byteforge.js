document.addEventListener('DOMContentLoaded', () => {
    let centralArrayOfInt = new Uint8Array();

    let bg_err;
    let bg_ok;
    let bg_hl;
    let fg_err;
    let fg_ok;

    updateColors();

    const bcConsole = document.getElementById('bcConsole');
    bcConsole.value = '';

    let isUpdating = false;

    let endiannessFloat = document.getElementById('bcEndiannessFloat').value;
    let endiannessInt = document.getElementById('bcEndiannessInt').value;
    let stringSubstituteEnable = document.getElementById('bcStringSubstituteEnable').checked;
    let stringSubstituteChar = document.getElementById('bcStringSubstituteChar').value;

    let byteArrayPrefix = document.getElementById('bcByteArrayPrefix').checked;
    let byteArraySpace = document.getElementById('bcByteArraySpace').checked;
    let byteArraySepChar = document.querySelector('input[name="bcByteArraySepChar"]:checked').value;
    let floatSepChar = document.querySelector('input[name="bcFloatSep"]:checked').value;

    const inputsConfig = [
        {
            element: document.getElementById('bcByteArrayHex'),
            parse: (val) => parseByteArrayHex(val),
            format: (val) => composeByteArrayHex(val, byteArrayPrefix, byteArraySpace, byteArraySepChar),
        },
        {
            element: document.getElementById('bcByteArrayDec'),
            parse: (val) => parseByteArrayDec(val),
            format: (val) => composeByteArrayDec(val, byteArrayPrefix, byteArraySpace, byteArraySepChar),
        },
        {
            element: document.getElementById('bcByteArrayOct'),
            parse: (val) => parseByteArrayOct(val),
            format: (val) => composeByteArrayOct(val, byteArrayPrefix, byteArraySpace, byteArraySepChar),
        },
        {
            element: document.getElementById('bcByteArrayBin'),
            parse: (val) => parseByteArrayBin(val),
            format: (val) => composeByteArrayBin(val, byteArrayPrefix, byteArraySpace, byteArraySepChar),
        },
        {
            element: document.getElementById('bcStringASCII'),
            parse: (val) => parseStringASCII(val),
            format: (val) => composeASCIIString(val, stringSubstituteEnable, stringSubstituteChar),
        },
        {
            element: document.getElementById('bcStringUTF8'),
            parse: (val) => parseStringUTF8(val),
            format: (val) => composeStringUTF8(val, stringSubstituteEnable, stringSubstituteChar),
        },
        {
            element: document.getElementById('bcFloat32'),
            parse: (val) => parseFloat32(val, endiannessFloat),
            format: (val) => composeFloat32(val, endiannessFloat, floatSepChar),
        },
        {
            element: document.getElementById('bcFloat64'),
            parse: (val) => parseFloat64(val, endiannessFloat),
            format: (val) => composeFloat64(val, endiannessFloat, floatSepChar),
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
            parse: (val) => parseInt32(val, endiannessInt, false),
            format: (val) => composeInt32(val, endiannessInt, false),
        },
        {
            element: document.getElementById('bcUint64'),
            parse: (val) => parseInt64(val, endiannessInt, false),
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
            parse: (val) => parseInt32(val, endiannessInt, true),
            format: (val) => composeInt32(val, endiannessInt, true),
        },
        {
            element: document.getElementById('bcInt64'),
            parse: (val) => parseInt64(val, endiannessInt, true),
            format: (val) => composeInt64(val, endiannessInt, true),
        }
    ];

    const bcByteArrayLength = document.querySelectorAll('.bcByteArrayLength');
    const bcStringLength = [
        {
            len: document.getElementById('bcStringASCIILength'),
            src: document.getElementById('bcStringASCII')
        },
        {
            len: document.getElementById('bcStringUTF8Length'),
            src: document.getElementById('bcStringUTF8')
        }
    ];

    const bcEndiannessInt = document.getElementById('bcEndiannessInt');
    bcEndiannessInt.addEventListener('change', (event) => {
        endiannessInt = event.target.value;
        updateAllInputs(-1);
    });

    const bcEndiannessFloat = document.getElementById('bcEndiannessFloat');
    bcEndiannessFloat.addEventListener('change', (event) => {
        endiannessFloat = event.target.value;
        updateAllInputs(-1);
    });

    const bcStringSubstituteEnable = document.getElementById('bcStringSubstituteEnable');
    bcStringSubstituteEnable.addEventListener('input', (event) => {
        stringSubstituteEnable = event.target.checked;
        updateAllInputs(-1);
    });

    const bcStringSubstituteChar = document.getElementById('bcStringSubstituteChar');
    bcStringSubstituteChar.addEventListener('input', (event) => {
        stringSubstituteChar = event.target.value;
        updateAllInputs(-1);
    });

    const bcByteArrayPrefix = document.getElementById('bcByteArrayPrefix');
    bcByteArrayPrefix.addEventListener('input', (event) => {
        byteArrayPrefix = event.target.checked;
        updateAllInputs(-1);
    });

    const bcByteArraySpace = document.getElementById('bcByteArraySpace');
    bcByteArraySpace.addEventListener('input', (event) => {
        byteArraySpace = event.target.checked;
        updateAllInputs(-1);
    });

    const bcByteArraySepChar = document.querySelectorAll('input[name="bcByteArraySepChar"]');
    bcByteArraySepChar.forEach((radio) => {
        radio.addEventListener('input', (event) => {
            byteArraySepChar = event.target.value;
            updateAllInputs(-1);
        });
    });

    const bcFloatSep = document.querySelectorAll('input[name="bcFloatSep"]');
    bcFloatSep.forEach((radio) => {
        radio.addEventListener('input', (event) => {
            floatSepChar = event.target.value;
            updateAllInputs(-1);
        });
    });

    inputsConfig.forEach((inputConfig, index) => {
        inputConfig.element.addEventListener('input', () => {
            if (isUpdating || !inputConfig.parse) return;
            const parsedValue = inputConfig.parse(inputConfig.element.value);
            if (!parsedValue.success) {
                inputConfig.element.style.color = fg_err;
                if (parsedValue.message)
                    bcConsole.value = parsedValue.message + '\n';
                return;
            }
            inputConfig.element.style.color = fg_ok;
            centralArrayOfInt = parsedValue.result;
            updateAllInputs(index);
        });
    });

    function updateAllInputs(excludeIndex) {
        isUpdating = true;
        bcConsole.value = '';
        inputsConfig.forEach((inputConfig, index) => {
            if (inputConfig.element === document.activeElement) {
                inputConfig.element.style.backgroundColor = bg_hl;
            } else {
                inputConfig.element.style.backgroundColor = bg_ok;
            }
            if (index === excludeIndex || !inputConfig.format) return; // skip
            out = inputConfig.format(centralArrayOfInt);
            inputConfig.element.style.color = fg_ok;
            if (out.success) {
                inputConfig.element.value = out.result;
            } else {
                inputConfig.element.style.backgroundColor = bg_err;
                inputConfig.element.value = '';
            }
        });

        bcByteArrayLength.forEach((element) => {
            if (centralArrayOfInt.length <= 0) {
                element.innerHTML = "";
            } else if (centralArrayOfInt.length == 1) {
                element.innerHTML = `(${centralArrayOfInt.length} byte)`;
            } else {
                element.innerHTML = `(${centralArrayOfInt.length} bytes)`;
            }
        });

        bcStringLength.forEach((element) => {
            if (element.src.value.length <= 0) {
                element.len.innerHTML = "";
            } else if (centralArrayOfInt.length == 1) {
                element.len.innerHTML = `(${element.src.value.length} character)`;
            } else {
                element.len.innerHTML = `(${element.src.value.length} characters)`;
            }
        });

        isUpdating = false;
    }

    function clearAll() {
        centralArrayOfInt = new Uint8Array();
        updateAllInputs(-1);
    }

    function updateColors() {
        bg_err = getComputedStyle(document.documentElement).getPropertyValue('--color-err-bg');
        bg_ok = getComputedStyle(document.documentElement).getPropertyValue('--color-bgform');
        bg_hl = getComputedStyle(document.documentElement).getPropertyValue('--color-bghl');
        fg_err = getComputedStyle(document.documentElement).getPropertyValue('--color-err-fg');
        fg_ok = getComputedStyle(document.documentElement).getPropertyValue('--color-fg');
    }

    window.callClearAll = function() {
        clearAll();
    }

    window.callUpdateAll = function() {
        updateColors();
        updateAllInputs(-1);
    }

    const helpBtn = document.getElementById('helpBtn');
    const helpOverlay = document.getElementById('helpOverlay');

    helpBtn.addEventListener('click', function() {
        helpOverlay.classList.toggle('active');
    });

    helpOverlay.addEventListener('click', function(e) {
        if (e.target === helpOverlay) {
            helpOverlay.classList.remove('active');
        }
    });

    updateAllInputs(-1);
});
