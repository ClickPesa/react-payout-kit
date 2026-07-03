import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "antd/lib/form";
import Radio from "antd/lib/radio";
import Select from "antd/lib/select";
import Input from "antd/lib/input";
import Alert from "antd/lib/alert";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./styles.css";
import type { PayoutDestinationFieldsProps } from "./types";
import { resolveMnoNamecheckChannel } from "./namecheck";
import { getMNOChannel, validateTanzanianPhoneNumber } from "./mno";
import { BankIcon, PhoneIcon } from "./icons";
import Spinner from "./Spinner";

const { Option } = Select;

const DEFAULT_FIELD_NAMES = {
  destinationType: "destination_type",
  channelProvider: "channel_provider",
  accountNumber: "account_number",
  accountName: "account_name",
};

const formatAmount = (value: number) =>
  new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);

export const PayoutDestinationFields = ({
  form,
  theme,
  fetchBanks,
  verifyName,
  fieldNames: fieldNamesProp,
  disabled = false,
  amount,
  currency,
}: PayoutDestinationFieldsProps) => {
  const fieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNamesProp };
  const destinationType = Form.useWatch(fieldNames.destinationType, form);
  const channelProvider = Form.useWatch(fieldNames.channelProvider, form);
  const accountNumber = Form.useWatch(fieldNames.accountNumber, form);

  const [banks, setBanks] = useState<
    import("./types").Bank[]
  >([]);
  const [banksLoading, setBanksLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifiedName, setVerifiedName] = useState<string | undefined>();

  const bankOptions = useMemo(
    () =>
      banks.map((bank) => ({
        label: bank.name,
        value: bank.value,
      })),
    [banks]
  );

  const detectedMno = useMemo(() => {
    if (destinationType !== "MNO" || !accountNumber) {
      return undefined;
    }
    return getMNOChannel(accountNumber);
  }, [destinationType, accountNumber]);

  const nameCheckChannel =
    destinationType === "MNO"
      ? resolveMnoNamecheckChannel(detectedMno?.value)
      : resolveMnoNamecheckChannel(channelProvider);

  const canVerifyName =
    !disabled &&
    !!nameCheckChannel &&
    !!accountNumber &&
    (destinationType === "BANK" || accountNumber.length >= 12);

  const resetVerifiedName = useCallback(() => {
    setVerifiedName(undefined);
  }, []);

  useEffect(() => {
    let cancelled = false;
    setBanksLoading(true);
    fetchBanks()
      .then((data) => {
        if (!cancelled) {
          setBanks(data);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setBanksLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [fetchBanks]);

  useEffect(() => {
    resetVerifiedName();
    if (destinationType === "MNO") {
      form.setFieldValue(fieldNames.channelProvider, detectedMno?.value);
      if (!accountNumber) {
        form.setFieldValue(fieldNames.accountName, undefined);
      }
    }
  }, [
    destinationType,
    accountNumber,
    channelProvider,
    detectedMno?.value,
    form,
    fieldNames.channelProvider,
    fieldNames.accountName,
    resetVerifiedName,
  ]);

  const handleDestinationTypeChange = () => {
    form.setFieldsValue({
      [fieldNames.channelProvider]: undefined,
      [fieldNames.accountNumber]: undefined,
      [fieldNames.accountName]: undefined,
    });
    resetVerifiedName();
  };

  const handleVerifyName = () => {
    if (!nameCheckChannel || !accountNumber) {
      return;
    }

    setVerifyLoading(true);
    verifyName({
      mobile_number: accountNumber,
      mno_name: nameCheckChannel,
    })
      .then((response) => {
        const fullName = response?.full_name;
        setVerifiedName(fullName);
        form.setFieldValue(fieldNames.accountName, fullName);
      })
      .finally(() => {
        setVerifyLoading(false);
      });
  };

  const renderNameCheckRow = () => {
    if (!canVerifyName) {
      return null;
    }

    return (
      <div className="rpk-namecheck">
        {!verifiedName && !verifyLoading && (
          <button
            type="button"
            className="rpk-verify-btn"
            onClick={handleVerifyName}
            disabled={disabled}
          >
            Verify Name
          </button>
        )}
        {verifyLoading && <Spinner height={24} />}
        {verifiedName && !verifyLoading && (
          <span className="rpk-verified-name">{verifiedName}</span>
        )}
      </div>
    );
  };

  const phoneLabel =
    detectedMno?.label ? `${detectedMno.label} Number` : "Mobile Number";

  return (
    <div className={`rpk-payout-fields ${theme}`}>
      {/* Send Via */}
      <div className="rpk-field rpk-send-via">
        <div className="rpk-label">Send Via</div>
        <Form.Item
          name={fieldNames.destinationType}
          rules={[
            { required: true, message: "Send via is required" },
          ]}
        >
          <Radio.Group
            disabled={disabled}
            onChange={handleDestinationTypeChange}
            style={{ width: "100%" }}
          >
            <Radio
              value="MNO"
              className={`rpk-radio-card ${
                destinationType === "MNO" ? "active" : ""
              }`}
            >
              <p className="rpk-radio-content">
                MOBILE MONEY
                <PhoneIcon />
              </p>
            </Radio>
            <Radio
              value="BANK"
              className={`rpk-radio-card ${
                destinationType === "BANK" ? "active" : ""
              }`}
            >
              <p className="rpk-radio-content">
                BANK
                <BankIcon />
              </p>
            </Radio>
          </Radio.Group>
        </Form.Item>
      </div>

      {/* Amount (read-only) */}
      {amount !== undefined && currency && (
        <div className="rpk-field rpk-amount">
          <div className="rpk-label">Amount</div>
          <div className="rpk-amount-row">
            <div className="rpk-amount-currency">
              <span className="rpk-currency-badge">{currency}</span>
            </div>
            <span className="rpk-amount-value">{formatAmount(amount)}</span>
          </div>
        </div>
      )}

      {/* Mobile Money */}
      {destinationType === "MNO" && (
        <>
          <Form.Item name={fieldNames.channelProvider} hidden>
            <Input />
          </Form.Item>
          <div className="rpk-field rpk-phone">
            <div className="rpk-label">{phoneLabel}</div>
            <Form.Item
              name={fieldNames.accountNumber}
              rules={[
                { required: true, message: "Mobile number is required" },
                {
                  validator: (_: unknown, value: string) =>
                    validateTanzanianPhoneNumber(value),
                },
              ]}
            >
              <PhoneInput
                country="tz"
                onlyCountries={["tz"]}
                disableDropdown
                specialLabel=""
                placeholder="Enter mobile number"
                disabled={disabled}
                containerClass={`tel-input ${theme}`}
                inputStyle={{
                  width: "100%",
                  height: "39px",
                  fontSize: 14,
                  color: "#575962",
                  fontFamily: "inherit",
                  border: "none",
                  background: "none",
                }}
              />
            </Form.Item>
            {renderNameCheckRow()}
          </div>
          {accountNumber && !detectedMno && (
            <Alert
              type="warning"
              showIcon
              message="Unsupported mobile money number"
              description="This number does not match a supported Tanzanian mobile money provider."
            />
          )}
        </>
      )}

      {/* Bank */}
      {destinationType === "BANK" && (
        <>
          <div className="rpk-field">
            <div className="rpk-label">Bank Name</div>
            <Form.Item
              name={fieldNames.channelProvider}
              rules={[{ required: true, message: "Bank name is required" }]}
            >
              <Select
                showSearch
                placeholder={
                  banksLoading ? "Loading banks..." : "Select bank"
                }
                disabled={disabled || banksLoading}
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.children as unknown as string)
                    ?.toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {bankOptions.map((bank) => (
                  <Option key={bank.value} value={bank.value}>
                    {bank.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="rpk-field">
            <div className="rpk-label">Account Number</div>
            <Form.Item
              name={fieldNames.accountNumber}
              rules={[
                { required: true, message: "Account number is required" },
              ]}
            >
              <Input
                placeholder="Enter account number"
                disabled={disabled}
              />
            </Form.Item>
            {renderNameCheckRow()}
          </div>
        </>
      )}

      {/* Account Name */}
      {(destinationType === "BANK" || destinationType === "MNO") && (
        <div className="rpk-field">
          <div className="rpk-label">Account Name</div>
          <Form.Item
            name={fieldNames.accountName}
            rules={[
              { required: true, message: "Account name is required" },
            ]}
          >
            <Input
              placeholder="Account name"
              disabled={disabled}
            />
          </Form.Item>
        </div>
      )}
    </div>
  );
};
