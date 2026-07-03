"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayoutDestinationFields = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const form_1 = __importDefault(require("antd/lib/form"));
const radio_1 = __importDefault(require("antd/lib/radio"));
const select_1 = __importDefault(require("antd/lib/select"));
const input_1 = __importDefault(require("antd/lib/input"));
const alert_1 = __importDefault(require("antd/lib/alert"));
const react_phone_input_2_1 = __importDefault(require("react-phone-input-2"));
require("react-phone-input-2/lib/style.css");
require("./styles.css");
const namecheck_1 = require("./namecheck");
const mno_1 = require("./mno");
const icons_1 = require("./icons");
const Spinner_1 = __importDefault(require("./Spinner"));
const { Option } = select_1.default;
const DEFAULT_FIELD_NAMES = {
    destinationType: "destination_type",
    channelProvider: "channel_provider",
    accountNumber: "account_number",
    accountName: "account_name",
};
const formatAmount = (value) => new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
}).format(value);
const PayoutDestinationFields = ({ form, theme, fetchBanks, verifyName, fieldNames: fieldNamesProp, disabled = false, amount, currency, }) => {
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
    const renderNameCheckRow = () => {
        if (!canVerifyName) {
            return null;
        }
        return ((0, jsx_runtime_1.jsxs)("div", { className: "rpk-namecheck", children: [!verifiedName && !verifyLoading && ((0, jsx_runtime_1.jsx)("button", { type: "button", className: "rpk-verify-btn", onClick: handleVerifyName, disabled: disabled, children: "Verify Name" })), verifyLoading && (0, jsx_runtime_1.jsx)(Spinner_1.default, { height: 24 }), verifiedName && !verifyLoading && ((0, jsx_runtime_1.jsx)("span", { className: "rpk-verified-name", children: verifiedName }))] }));
    };
    const phoneLabel = detectedMno?.label ? `${detectedMno.label} Number` : "Mobile Number";
    return ((0, jsx_runtime_1.jsxs)("div", { className: `rpk-payout-fields ${theme}`, children: [(0, jsx_runtime_1.jsxs)("div", { className: "rpk-field rpk-send-via", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-label", children: "Send Via" }), (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.destinationType, rules: [
                            { required: true, message: "Send via is required" },
                        ], children: (0, jsx_runtime_1.jsxs)(radio_1.default.Group, { disabled: disabled, onChange: handleDestinationTypeChange, style: { width: "100%" }, children: [(0, jsx_runtime_1.jsx)(radio_1.default, { value: "MNO", className: `rpk-radio-card ${destinationType === "MNO" ? "active" : ""}`, children: (0, jsx_runtime_1.jsxs)("p", { className: "rpk-radio-content", children: ["MOBILE MONEY", (0, jsx_runtime_1.jsx)(icons_1.PhoneIcon, {})] }) }), (0, jsx_runtime_1.jsx)(radio_1.default, { value: "BANK", className: `rpk-radio-card ${destinationType === "BANK" ? "active" : ""}`, children: (0, jsx_runtime_1.jsxs)("p", { className: "rpk-radio-content", children: ["BANK", (0, jsx_runtime_1.jsx)(icons_1.BankIcon, {})] }) })] }) })] }), amount !== undefined && currency && ((0, jsx_runtime_1.jsxs)("div", { className: "rpk-field rpk-amount", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-label", children: "Amount" }), (0, jsx_runtime_1.jsxs)("div", { className: "rpk-amount-row", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-amount-currency", children: (0, jsx_runtime_1.jsx)("span", { className: "rpk-currency-badge", children: currency }) }), (0, jsx_runtime_1.jsx)("span", { className: "rpk-amount-value", children: formatAmount(amount) })] })] })), destinationType === "MNO" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.channelProvider, hidden: true, children: (0, jsx_runtime_1.jsx)(input_1.default, {}) }), (0, jsx_runtime_1.jsxs)("div", { className: "rpk-field rpk-phone", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-label", children: phoneLabel }), (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.accountNumber, rules: [
                                    { required: true, message: "Mobile number is required" },
                                    {
                                        validator: (_, value) => (0, mno_1.validateTanzanianPhoneNumber)(value),
                                    },
                                ], children: (0, jsx_runtime_1.jsx)(react_phone_input_2_1.default, { country: "tz", onlyCountries: ["tz"], disableDropdown: true, specialLabel: "", placeholder: "Enter mobile number", disabled: disabled, containerClass: `tel-input ${theme}`, inputStyle: {
                                        width: "100%",
                                        height: "39px",
                                        fontSize: 14,
                                        color: "#575962",
                                        fontFamily: "inherit",
                                        border: "none",
                                        background: "none",
                                    } }) }), renderNameCheckRow()] }), accountNumber && !detectedMno && ((0, jsx_runtime_1.jsx)(alert_1.default, { type: "warning", showIcon: true, message: "Unsupported mobile money number", description: "This number does not match a supported Tanzanian mobile money provider." }))] })), destinationType === "BANK" && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "rpk-field", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-label", children: "Bank Name" }), (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.channelProvider, rules: [{ required: true, message: "Bank name is required" }], children: (0, jsx_runtime_1.jsx)(select_1.default, { showSearch: true, placeholder: banksLoading ? "Loading banks..." : "Select bank", disabled: disabled || banksLoading, optionFilterProp: "children", filterOption: (input, option) => option?.children
                                        ?.toLowerCase()
                                        .indexOf(input.toLowerCase()) >= 0, children: bankOptions.map((bank) => ((0, jsx_runtime_1.jsx)(Option, { value: bank.value, children: bank.label }, bank.value))) }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "rpk-field", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-label", children: "Account Number" }), (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.accountNumber, rules: [
                                    { required: true, message: "Account number is required" },
                                ], children: (0, jsx_runtime_1.jsx)(input_1.default, { placeholder: "Enter account number", disabled: disabled }) }), renderNameCheckRow()] })] })), (destinationType === "BANK" || destinationType === "MNO") && ((0, jsx_runtime_1.jsxs)("div", { className: "rpk-field", children: [(0, jsx_runtime_1.jsx)("div", { className: "rpk-label", children: "Account Name" }), (0, jsx_runtime_1.jsx)(form_1.default.Item, { name: fieldNames.accountName, rules: [
                            { required: true, message: "Account name is required" },
                        ], children: (0, jsx_runtime_1.jsx)(input_1.default, { placeholder: "Account name", disabled: disabled }) })] }))] }));
};
exports.PayoutDestinationFields = PayoutDestinationFields;
