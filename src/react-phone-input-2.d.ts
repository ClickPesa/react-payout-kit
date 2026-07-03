declare module "react-phone-input-2" {
  import type { ComponentType, CSSProperties } from "react";

  export interface PhoneInputProps {
    country?: string;
    onlyCountries?: string[];
    disableDropdown?: boolean;
    specialLabel?: string;
    placeholder?: string;
    disabled?: boolean;
    containerClass?: string;
    inputStyle?: CSSProperties;
    value?: string;
    onChange?: (value: string, data: unknown, event: unknown, formattedValue: string) => void;
  }

  const PhoneInput: ComponentType<PhoneInputProps>;
  export default PhoneInput;
}
