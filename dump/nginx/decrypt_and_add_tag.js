async function decryptAndAddTag(r) {
    try {
        const privateKeyPem = await fetch('/etc/nginx/ssl/private_key.pem').then(res => res.text());
        const privateKey = await crypto.subtle.importKey(
            "pkcs8",
            str2ab(privateKeyPem),
            {
                name: "RSA-OAEP",
                hash: "SHA-256"
            },
            false,
            ["decrypt"]
        );

        const encryptedData = str2ab(atob(r.requestBody));

        const decryptedData = await crypto.subtle.decrypt(
            {
                name: "RSA-OAEP"
            },
            privateKey,
            encryptedData
        );

        const decodedData = new TextDecoder().decode(decryptedData);
        const jsonData = JSON.parse(decodedData);
        jsonData.new_tag = "new_value";

        return JSON.stringify(jsonData);
    } catch (e) {
        r.return(400, '{"error":"invalid json or decryption failed"}');
    }
}

function str2ab(str) {
    const buf = new ArrayBuffer(str.length * 2);
    const bufView = new Uint16Array(buf);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
}

export default { decryptAndAddTag };
