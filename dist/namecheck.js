"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMnoNamecheckChannel = void 0;
const supportedMNONameChecks = [
    "airtel",
    "tigo",
    "ezypesa",
    "mpesa",
    "halopesa",
    "ttcl",
    "azampesa",
    "crdb",
];
const MNO_NAMECHECK_CHANNEL_ALIASES = {
    ezy: "ezypesa",
};
const resolveMnoNamecheckChannel = (channelProvider) => {
    if (!channelProvider) {
        return undefined;
    }
    const prefix = channelProvider.split("_")[0]?.toLowerCase();
    if (!prefix) {
        return undefined;
    }
    const resolved = (MNO_NAMECHECK_CHANNEL_ALIASES[prefix] ||
        prefix);
    return supportedMNONameChecks.includes(resolved) ? resolved : undefined;
};
exports.resolveMnoNamecheckChannel = resolveMnoNamecheckChannel;
