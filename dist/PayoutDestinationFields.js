"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutDestinationFields = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const form_1 = __importDefault(require("antd/lib/form"));
const row_1 = __importDefault(require("antd/lib/row"));
const col_1 = __importDefault(require("antd/lib/col"));
const input_1 = __importDefault(require("antd/lib/input"));
const alert_1 = __importDefault(require("antd/lib/alert"));
const components_library_inputs_select_input_1 = require("@clickpesa/components-library.inputs.select-input");
const components_library_inputs_text_input_1 = require("@clickpesa/components-library.inputs.text-input");
const namecheck_1 = require("./namecheck");
const mno_1 = require("./mno");
const Spinner_1 = __importDefault(require("./Spinner"));
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
const PayoutDestinationFields = ({ form, theme, fetchBanks, verifyName, fieldNames: fieldNamesProp, disabled = false, }) => {
    const fieldNames = { ...DEFAULT_FIELD_NAMES, ...fieldNamesProp };
    const destinationType = form_1.default.useWatch(fieldNames.destinationType, form);
    const channelProvider = form_1.default.useWatch(fieldNames.channelProvider, form);
    const accountNumber = form_1.default.useWatch(fieldNames.accountNumber, form);
    const [banks, setBanks] = (0, react_1.useState)([]);
    const [banksLoading, setBanksLoading] = (0, react_1.useState)(false);
    const [verifyLoading, setVerifyLoading] = (0, react_1.useState)(false);
    const [verifiedName, setVerifiedName] = (0, react_1.useState)();
    const bankOptions = (0, react_1.useMemo)(() => banks.map((bank) => ({
        label: bank.name,
        value: bank.value,
    })), [banks]);
    const detectedMno = (0, react_1.useMemo)(() => {
        if (destinationType !== "MNO" || !accountNumber) {
            return undefined;
        }
        return (0, mno_1.getMNOChannel)(accountNumber);
    }, [destinationType, accountNumber]);
    const nameCheckChannel = destinationType === "MNO"
        ? (0, namecheck_1.resolveMnoNamecheckChannel)(detectedMno?.value)
        : (0, namecheck_1.resolveMnoNamecheckChannel)(channelProvider);
    const canVerifyName = !disabled &&
        !!nameCheckChannel &&
        !!accountNumber &&
        (destinationType === "BANK" || accountNumber.length >= 12);
    const resetVerifiedName = (0, react_1.useCallback)(() => {
        setVerifiedName(undefined);
    }, []);
    (0, react_1.useEffect)(() => {
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
    (0, react_1.useEffect)(() => {
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
        return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!verifiedName && !verifyLoading && ((0, jsx_runtime_1.jsx)("button", { type: "button", style: verifyNameButtonStyle, onClick: handleVerifyName, disabled: disabled, children: "Verify Name" })), verifyLoading && (0, jsx_runtime_1.jsx)(Spinner_1.default, { height: 24 }), verifiedName && !verifyLoading && ((0, jsx_runtime_1.jsx)("span", { style: { fontSize: "14px" }, children: verifiedName }))] }));
    };
    return ((0, jsx_runtime_1.jsxs)(row_1.default, { gutter: [12, 16], children: [(0, jsx_runtime_1.jsx)(col_1.default, { span: 24, children: (0, jsx_runtime_1.jsx)(components_library_inputs_select_input_1.SelectInput, { isFormItem: true, name: fieldNames.destinationType, label: "Destination Type", placeholder: "Select destination type", mode: theme, disabled: disabled, options: [
                        { label: "MOBILE MONEY", value: "MNO" },
                        { label: "BANK", value: "BANK" },
                    ], onChange: handleDestinationTypeChange, rules: [
                        {
                            required: true,
                            message: "Destination type is required",
                        },
                    ] }) }), destinationType === "BANK" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(col_1.default, { span: 24, children: (0, jsx_runtime_1.jsx)(components_library_inputs_select_input_1.SelectInput, { isFormItem: true, name: fieldNames.channelProvider, label: "Bank Name", placeholder: banksLoading ? "Loading banks..." : "Select bank", mode: theme, disabled: disabled, options: bankOptions, rules: [
                                {
                                    required: true,
                                    message: "Bank name is required",
                                },
                            ] }) }), (0, jsx_runtime_1.jsx)(col_1.default, { span: 24, children: (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.accountNumber, label: "Account Number", className: `basic-text-input ${theme}`, extra: renderNameCheckExtra(), rules: [
                                {
                                    required: true,
                                    message: "Account number is required",
                                },
                            ], children: (0, jsx_runtime_1.jsx)(input_1.default, { placeholder: "Enter account number", className: `basic-text-input-item ${theme}`, disabled: disabled }) }) })] })), destinationType === "MNO" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.channelProvider, hidden: true, children: (0, jsx_runtime_1.jsx)(input_1.default, {}) }), (0, jsx_runtime_1.jsx)(col_1.default, { span: 24, children: (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.accountNumber, label: detectedMno?.label
                                ? `${detectedMno.label} Number`
                                : "Mobile Number", className: `basic-text-input ${theme}`, extra: renderNameCheckExtra(), rules: [
                                {
                                    required: true,
                                    message: "Mobile number is required",
                                },
                                {
                                    validator: (_, value) => (0, mno_1.validateTanzanianPhoneNumber)(value),
                                },
                            ], children: (0, jsx_runtime_1.jsx)(input_1.default, { placeholder: "255600000000", className: `basic-text-input-item ${theme}`, disabled: disabled }) }) }), accountNumber && !detectedMno && ((0, jsx_runtime_1.jsx)(col_1.default, { span: 24, children: (0, jsx_runtime_1.jsx)(alert_1.default, { type: "warning", showIcon: true, message: "Unsupported mobile money number", description: "This number does not match a supported Tanzanian mobile money provider." }) }))] })), (destinationType === "BANK" || destinationType === "MNO") && ((0, jsx_runtime_1.jsx)(col_1.default, { span: 24, children: (0, jsx_runtime_1.jsx)(components_library_inputs_text_input_1.TextInput, { isFormItem: true, name: fieldNames.accountName, label: "Account Name", placeholder: "Account name", mode: theme, disabled: disabled, rules: [
                        {
                            required: true,
                            message: "Account name is required",
                        },
                    ] }) }))] }));
};
exports.PayoutDestinationFields = PayoutDestinationFields;
