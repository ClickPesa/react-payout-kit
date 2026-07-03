"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const Spinner = ({ height = 24 }) => ((0, jsx_runtime_1.jsxs)("div", { style: {
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }, children: [(0, jsx_runtime_1.jsx)("div", { style: {
                width: 16,
                height: 16,
                border: "2px solid #1890ff",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "react-payout-kit-spin 0.8s linear infinite",
            } }), (0, jsx_runtime_1.jsx)("style", { children: `@keyframes react-payout-kit-spin { to { transform: rotate(360deg); } }` })] }));
exports.default = Spinner;
