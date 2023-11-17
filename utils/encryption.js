const crypto = require('crypto');
let bufferinput = process.env.KEY;
let key  = {}; // process.env.KEY//
const iv = crypto.randomBytes(16);//process.env.IV//

class encryption {
//Encrypting text
      static setup() {
        let bufferarr = bufferinput.match(/.{2}/g)
        for (let i = 0; i <  bufferarr.length; i++) {
            bufferarr[i] = parseInt(bufferarr[i], 16)
        }
        key = {type: "Buffer",
            data: bufferarr
        }
        //console.log(key)
    }

    static encrypt(text) {
        let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
        let encrypted = cipher.update(text);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
    }

// Decrypting text

    static decrypt(text) {
        let iv = Buffer.from(text.iv, 'hex');
        let encryptedText = Buffer.from(text.encryptedData, 'hex');
        let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

}


module.exports = encryption;