import type { Bank } from "./types";
export declare const MOBILE_MONEY = "MOBILE MONEY";
export declare const BANK_TRANSFER = "BANK TRANSFER";
export declare const MNO_NAMES: {
    label: string;
    value: string;
    alias: string;
}[];
export declare const getMNOChannel: (accountNumber: string) => {
    label: string;
    value: string;
    alias: string;
} | undefined;
export declare const validateTanzanianPhoneNumber: (value?: string) => Promise<void>;
export declare const getMnoProviderLabel: (value?: string) => string | undefined;
export declare const getBankProviderLabel: (banks: Bank[] | undefined, value?: string) => string | undefined;
export declare const getPayoutProviderLabel: (banks: Bank[] | undefined, value?: string, destinationType?: "MNO" | "BANK") => string | undefined;
