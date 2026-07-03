"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPayoutProviderLabel = exports.getBankProviderLabel = exports.getMnoProviderLabel = exports.validateTanzanianPhoneNumber = exports.getMNOChannel = exports.MNO_NAMES = exports.BANK_TRANSFER = exports.MOBILE_MONEY = void 0;
const tanzanian_phone_validator_1 = require("tanzanian-phone-validator");
exports.MOBILE_MONEY = "MOBILE MONEY";
exports.BANK_TRANSFER = "BANK TRANSFER";
exports.MNO_NAMES = [
    { label: "AIRTEL MONEY", value: "airtel_money_tanzania", alias: "airtel" },
    { label: "EZY PESA", value: "ezy_pesa_tanzania", alias: "ezyPesa" },
    { label: "MPESA", value: "mpesa_tanzania", alias: "Vodacom" },
    { label: "TIGO PESA", value: "tigo_pesa_tanzania", alias: "tiGo" },
    { label: "HALOPESA", value: "halopesa_tanzania", alias: "halotel" },
    { label: "Smart", value: "smart", alias: "Smart" },
    { label: "TTCL", value: "ttcl", alias: "TTCL" },
    { label: "CooTel", value: "cootel", alias: "CooTel" },
    { label: "Amotel", value: "amotel", alias: "Amotel" },
];
const getMNOChannel = (accountNumber) => {
    const phoneDetails = (0, tanzanian_phone_validator_1.getPhoneNumberDetails)(accountNumber?.startsWith("+") ? accountNumber : `+${accountNumber}`);
    return exports.MNO_NAMES.find((mno) => (phoneDetails?.telecomCompanyDetails?.prefix === 77 &&
        mno.alias === "ezyPesa") ||
        mno.alias === phoneDetails?.telecomCompanyDetails?.brand);
};
exports.getMNOChannel = getMNOChannel;
const validateTanzanianPhoneNumber = (value) => {
    if (!value) {
        return Promise.resolve();
    }
    if ((0, tanzanian_phone_validator_1.isValidPhoneNumber)(value)) {
        return Promise.resolve();
    }
    return Promise.reject(new Error("Invalid mobile number"));
};
exports.validateTanzanianPhoneNumber = validateTanzanianPhoneNumber;
const getMnoProviderLabel = (value) => exports.MNO_NAMES.find((mno) => mno.value === value)?.label || value;
exports.getMnoProviderLabel = getMnoProviderLabel;
const getBankProviderLabel = (banks, value) => banks?.find((bank) => bank.value === value)?.name || value;
exports.getBankProviderLabel = getBankProviderLabel;
const getPayoutProviderLabel = (banks, value, destinationType) => {
    if (!value) {
        return undefined;
    }
    if (destinationType === "MNO") {
        return (0, exports.getMnoProviderLabel)(value);
    }
    if (destinationType === "BANK") {
        return (0, exports.getBankProviderLabel)(banks, value);
    }
    return (0, exports.getMnoProviderLabel)(value) || (0, exports.getBankProviderLabel)(banks, value);
};
exports.getPayoutProviderLabel = getPayoutProviderLabel;
