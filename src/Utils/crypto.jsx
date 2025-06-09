import crypto from "crypto-js";

const code = "react02";

// Hàm mã hóa
export const encrypt = (value) => {
    return crypto.AES.encrypt(
        value,
        code
    ).toString()
}

// Hàm giải mã
export const decrypt = (value) => {
    return crypto.AES.decrypt(
        value,
        code
    ).toString(crypto.enc.Utf8)
}