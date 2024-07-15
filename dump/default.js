function arrayBufferToBase64(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = '';
    for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }
    var b64 = window.btoa(byteString);

    return b64;
}

// Function to convert Base64 string to ArrayBuffer
function base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    return bytes.buffer;
}

function addNewLines(str) {
    var finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

function toPem(privateKey) {
    var b64 = addNewLines(arrayBufferToBase64(privateKey));
    var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";

    return pem;
}


async function encrypt() {

    // Generate a key pair (you can also import an existing key pair)
    const keyPair = await crypto.subtle.generateKey(
        {
            name: 'RSA-OAEP',
            modulusLength: 2048,
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt']
    );

    // Export the public key
    const exportedPublicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const exportedPrivateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    // Import the public key (replace with your actual public key)
    const encryptedData = await crypto.subtle.importKey(
        'spki',
        exportedPublicKey,
        {
            name: 'RSA-OAEP',
            hash: 'SHA-256',
        },
        true,
        ['encrypt']
    ).then((importedPublicKey) => {
        const plainText = 'Hello, world!';
        const encodedText = new TextEncoder().encode(plainText);
        return crypto.subtle.encrypt(
            {
                name: 'RSA-OAEP',
            },
            importedPublicKey,
            encodedText
        );
    });


    // // Encrypt the plain text
    // const plainText = 'Hello, world!';
    // const encodedText = new TextEncoder().encode(plainText);
    // const encryptedData = await crypto.subtle.encrypt(
    //     {
    //         name: 'RSA-OAEP',
    //     },
    //     importedPublicKey,
    //     encodedText
    // );

    // Convert the encrypted data to base64 for transmission
    const base64EncryptedData = btoa(String.fromCharCode.apply(null, new Uint8Array(encryptedData)));


    const exportedPublicKeyb64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPublicKey)));
    const exportedPrivateKeyb64 = btoa(String.fromCharCode.apply(null, new Uint8Array(exportedPrivateKey)));

    console.log('Encrypted data:', base64EncryptedData);
    console.log('Public Key:', exportedPublicKeyb64);
    console.log('Private Key:', exportedPrivateKeyb64);

    const dataToDecrypt = base64ToArrayBuffer(base64EncryptedData)


    const importedPrivateKey = await window.crypto.subtle.importKey(
        'pkcs8',
        exportedPrivateKey,
        { name: 'RSA-OAEP', hash: { name: 'SHA-256' } },
        true,
        ['decrypt']
    );

    // Decrypt the RSA ciphertext
    const decryptionResult = await window.crypto.subtle.decrypt(
        {
            name: 'RSA-OAEP',
            hash: { name: 'SHA-256' },
        },
        importedPrivateKey,
        // encryptedData
        dataToDecrypt
    );

    console.log('decryptionResult:', decryptionResult);

    const decryptedText = new TextDecoder().decode(decryptionResult);
    console.log('Decrypted RSA text:', decryptedText);

    const pem = toPem(exportedPrivateKey);

    console.log('Pem : ', pem);
}

encrypt()