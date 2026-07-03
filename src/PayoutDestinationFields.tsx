import { useCallback, useEffect, useMemo, useState } from "react";
import Form from "antd/lib/form";
import Row from "antd/lib/row";
import Col from "antd/lib/col";
import Input from "antd/lib/input";
import Alert from "antd/lib/alert";
import { SelectInput } from "@clickpesa/components-library.inputs.select-input";
import { TextInput } from "@clickpesa/components-library.inputs.text-input";
import type { Bank, PayoutDestinationFieldsProps } from "./types";
import { resolveMnoNamecheckChannel } from "./namecheck";
import { getMNOChannel, validateTanzanianPhoneNumber } from "./mno";
import Spinner from "./Spinner";

const verifyNameButtonStyle = {
  fontSize: "14px",
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  color: "#1890ff",
};

const DEFAULT_FIELD_NAMES = {
  destinationType: "destination_type",
  channelProvider: "channel_provider",
  accountNumber: "account_number",
  accountName: "account_name",
};

export const PayoutDestinationFields = ({
  form,
  theme,
  fetchBanks,
  verifyName,
  fieldNames: fieldNamesProp,
  disabled = false,
}: PayoutDestinationFieldsProps) => {
  const fieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNamesProp };
  const destinationType = Form.useWatch(fieldNames.destinationType, form);
  const channelProvider = Form.useWatch(fieldNames.channelProvider, form);
  const accountNumber = Form.useWatch(fieldNames.accountNumber, form);

  const [banks, setBanks] = useState<Bank[]>([]);
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

  const renderNameCheckExtra = () => {
    if (!canVerifyName) {
      return null;
    }

    return (
      <>
        {!verifiedName && !verifyLoading && (
          <button
            type="button"
            style={verifyNameButtonStyle}
            onClick={handleVerifyName}
            disabled={disabled}
          >
            Verify Name
          </button>
        )}
        {verifyLoading && <Spinner height={24} />}
        {verifiedName && !verifyLoading && (
          <span style={{ fontSize: "14px" }}>{verifiedName}</span>
        )}
      </>
    );
  };

  return (
    <Row gutter={[12, 16]}>
      <Col span={24}>
        <SelectInput
          isFormItem
          name={fieldNames.destinationType}
          label="Destination Type"
          placeholder="Select destination type"
          mode={theme}
          disabled={disabled}
          options={[
            { label: "MOBILE MONEY", value: "MNO" },
            { label: "BANK", value: "BANK" },
          ]}
          onChange={handleDestinationTypeChange}
          rules={[
            {
              required: true,
              message: "Destination type is required",
            },
          ]}
        />
      </Col>

      {destinationType === "BANK" && (
        <>
          <Col span={24}>
            <SelectInput
              isFormItem
              name={fieldNames.channelProvider}
              label="Bank Name"
              placeholder={banksLoading ? "Loading banks..." : "Select bank"}
              mode={theme}
              disabled={disabled}
              options={bankOptions}
              rules={[
                {
                  required: true,
                  message: "Bank name is required",
                },
              ]}
            />
          </Col>
          <Col span={24}>
            <Form.Item
              name={fieldNames.accountNumber}
              label="Account Number"
              className={`basic-text-input ${theme}`}
              extra={renderNameCheckExtra()}
              rules={[
                {
                  required: true,
                  message: "Account number is required",
                },
              ]}
            >
              <Input
                placeholder="Enter account number"
                className={`basic-text-input-item ${theme}`}
                disabled={disabled}
              />
            </Form.Item>
          </Col>
        </>
      )}

      {destinationType === "MNO" && (
        <>
          <Form.Item name={fieldNames.channelProvider} hidden>
            <Input />
          </Form.Item>
          <Col span={24}>
            <Form.Item
              name={fieldNames.accountNumber}
              label={
                detectedMno?.label
                  ? `${detectedMno.label} Number`
                  : "Mobile Number"
              }
              className={`basic-text-input ${theme}`}
              extra={renderNameCheckExtra()}
              rules={[
                {
                  required: true,
                  message: "Mobile number is required",
                },
                {
                  validator: (_: unknown, value: string) =>
                    validateTanzanianPhoneNumber(value),
                },
              ]}
            >
              <Input
                placeholder="255600000000"
                className={`basic-text-input-item ${theme}`}
                disabled={disabled}
              />
            </Form.Item>
          </Col>
          {accountNumber && !detectedMno && (
            <Col span={24}>
              <Alert
                type="warning"
                showIcon
                message="Unsupported mobile money number"
                description="This number does not match a supported Tanzanian mobile money provider."
              />
            </Col>
          )}
        </>
      )}

      {(destinationType === "BANK" || destinationType === "MNO") && (
        <Col span={24}>
          <TextInput
            isFormItem
            name={fieldNames.accountName}
            label="Account Name"
            placeholder="Account name"
            mode={theme}
            disabled={disabled}
            rules={[
              {
                required: true,
                message: "Account name is required",
              },
            ]}
          />
        </Col>
      )}
    </Row>
  );
};
