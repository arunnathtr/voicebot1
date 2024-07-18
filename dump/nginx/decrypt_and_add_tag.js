async function decryptAndAddTag(r) {
    try {
        const privateKeyPem = 'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC5aZ4aHZ7VcWRP02dSLSQtPaXLK9Aq9K4tCXjxt1bXQNeEkdR+fBUi1GZUNGNv2n0CKOkg7MFR9Oyc3H0IJSVyPSKcgGiOfmUC+PAtBAOySovJDXhLCBQtw77/4a6Y1Eljq0H+gwG5kywQX1PQEwFkZV4S+hB4gkk9Q0soKktsFm18D1h4tNt/DQk3YmbBYWYD5K2E3yNfYHZdA4NsCNLb+PP8XaavBUDIhFiJH2IExCmadGPRc1uutY2tG0OA/FQPu1Q9ozNFoh5M8smwmczy0KHiYzaoyo8CZ/TZqVQV8zJpxxAqrjbMzLbIi45CReTrNWFkNXExiCvcUfax+K7jAgMBAAECggEAHaGA6EiKjS7Zap5s2Seoq+g5uj3uvyaqPT1RzENSCAVvS9roXCxlTlMmZVeX+pSuvK0gEKh1fq0HMUxVWPtiwB6ADQXCb99IMlDpRTBqjNA4BbH24vrQCr5JJGiDOB5Y+iow2kVCfc9Ez/sEEHExHEPM5Hh9MF0V6kn6VVlpA0VOpqB14X4igoGI1MaLRVYfxu9eBXT+qaczMGPaC0rsU6uBvfoRgLkSf1KftzG9YwOZXLffG/Oa2S/e42OThwnI61yDnE6jgU1R90b88hF+dWCnPsK183Dw+GsPaOVGMDNstIA/YL0a41NPj/WalVMSF5YPjOJlxvJe6P0vnQim/QKBgQDczDu5A5EaKn3LymAjNkvLP94sMQppMSgjTdZN6XvK+i0TVxE9F2dp57EHXoZ+NJz0RZAccrwNhOZC3F3kPvaxP0xQPZAiSoI03cE3mRWnD5gDc6LMR/SIVUyKuVBSvmJNdZqYDIxxkOSljVfir63N0Qr0mobuJxs/a5o6m0XdjQKBgQDW+Sbf1BMSskikL/RE8H/dvLOJJCSaVyPuURXOirQM8Hpv0aE9vCsvjwZzO04LZ2qyjkPdrzAt18/BO8/EaTVJt5n/qoTmegXcll01IpcXI7wa5Ys/ZGUj0LUBDGwkS68h150XdalThC21Buo7MwgmShsxoDELOglAADr2+lOKLwKBgCNbtWiwcIkvKsv60aBx7ntS9AJBrDgiPhpBOcNqU3+yxoslU0ZkPBRSnR/f/Euzozre9PAJU6IamUE1xvdpOdoyl8b1xOIo6mcK6Ak+Q6BoN+C9oOFz2G4IsuQ4PuuxP07GOYaF4+u/103Hr75Ggd/GzSlUoaz7qDpkweMGwI51AoGAHON4hOWz9nQ87MuA8O680Ch2m/xeattA+dqtqobbMU3ztikemPQ7fXWj8UJL955bKUmS9yx+tfplcds+zW8x+QkSSdg5aduGBCG0vto6IaLsuVSVhNxR9yEp4c0wjyQYkdyuwKNQMOf3WHdobLIr6zFUPDQBwzd2XMJrKhtztIMCgYAe1aL7K/LYGi2UZg98tKMnFemk5RfABbPAvDSqCo2TNKrX4Ci1XvAQNLk+7Yxh/XBgyfo/g0st1DRKkn/MXPUGm68iRiN0msVBl65fVdF3pQS3hn1LzPtXq0RcHRNJmD1bTPx5g9CNzLIW9mqS6av4vuK+XwmBaUfEd/Fi0k7S4A==';
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
