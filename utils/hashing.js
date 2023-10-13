const {scryptSync, randomBytes} = require("crypto");


function hash(input) {
    const salt = randomBytes(16).toString("hex");
    const hashedPassword = scryptSync(input, salt, 64).toString("hex");

    return salt + ":" + hashedPassword
}
export default {hash}