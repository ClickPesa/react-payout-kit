export type SupportedMNOCheckChannel = "airtel" | "tigo" | "mpesa" | "halopesa" | "crdb";
export interface Bank {
    name: string;
    value: string;
}
export interface NameCheckResult {
    full_name: string;
}
export interface PayoutDestinationAdapters {
    fetchBanks: () => Promise<Bank[]>;
    verifyName: (body: {
        mno_name: SupportedMNOCheckChannel;
        mobile_number: string;
    }) => Promise<NameCheckResult>;
}
export interface PayoutDestinationFieldNames {
    destinationType?: string;
    channelProvider?: string;
    accountNumber?: string;
    accountName?: string;
}
export interface PayoutDestinationFieldsProps extends PayoutDestinationAdapters {
    form: import("antd/lib/form").FormInstance;
    theme: "dark" | "light";
    fieldNames?: PayoutDestinationFieldNames;
    disabled?: boolean;
    /** Pre-filled refund amount (displayed read-only) */
    amount?: number;
    /** Currency code for the read-only amount display */
    currency?: string;
}
