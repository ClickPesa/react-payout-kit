import {
  getPhoneNumberDetails,
  isValidPhoneNumber,
} from "tanzanian-phone-validator";
import type { Bank } from "./types";

export const MOBILE_MONEY = "MOBILE MONEY";
export const BANK_TRANSFER = "BANK TRANSFER";

export const MNO_NAMES = [
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

export const getMNOChannel = (accountNumber: string) => {
  const phoneDetails = getPhoneNumberDetails(
    accountNumber?.startsWith("+") ? accountNumber : `+${accountNumber}`
  );

  return MNO_NAMES.find(
    (mno) =>
      (phoneDetails?.telecomCompanyDetails?.prefix === 77 &&
        mno.alias === "ezyPesa") ||
      mno.alias === phoneDetails?.telecomCompanyDetails?.brand
  );
};

export const validateTanzanianPhoneNumber = (value?: string) => {
  if (!value) {
    return Promise.resolve();
  }
  if (!isValidPhoneNumber(value)) {
    return Promise.reject(new Error("Enter a valid Tanzanian mobile number"));
  }
  if (!getMNOChannel(value)) {
    return Promise.reject(
      new Error(
        "This number does not match a supported Tanzanian mobile money provider"
      )
    );
  }
  return Promise.resolve();
};

export const getMnoProviderLabel = (value?: string) =>
  MNO_NAMES.find((mno) => mno.value === value)?.label || value;

export const getBankProviderLabel = (
  banks: Bank[] | undefined,
  value?: string
) => banks?.find((bank) => bank.value === value)?.name || value;

export const getPayoutProviderLabel = (
  banks: Bank[] | undefined,
  value?: string,
  destinationType?: "MNO" | "BANK"
) => {
  if (!value) {
    return undefined;
  }
  if (destinationType === "MNO") {
    return getMnoProviderLabel(value);
  }
  if (destinationType === "BANK") {
    return getBankProviderLabel(banks, value);
  }
  return getMnoProviderLabel(value) || getBankProviderLabel(banks, value);
};
