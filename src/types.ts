export type SupportedMNOCheckChannel =
  | "airtel"
  | "tigo"
  | "ezypesa"
  | "mpesa"
  | "halopesa"
  | "ttcl"
  | "azampesa"
  | "crdb";

export interface Bank {
  name: string;
  value: string;
  bic?: string;
}

export interface NameCheckResult {
  full_name: string;
}

export interface NameCheckRequest {
  mobile_number: string;
  mno_name?: SupportedMNOCheckChannel;
  bic?: string;
}

export interface PayoutDestinationAdapters {
  fetchBanks: () => Promise<Bank[]>;
  verifyName: (body: NameCheckRequest) => Promise<NameCheckResult>;
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
