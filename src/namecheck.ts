import type { SupportedMNOCheckChannel } from "./types";

const supportedMNONameChecks: SupportedMNOCheckChannel[] = [
  "airtel",
  "tigo",
  "ezypesa",
  "mpesa",
  "halopesa",
  "ttcl",
  "azampesa",
  "crdb",
];

const MNO_NAMECHECK_CHANNEL_ALIASES: Record<string, SupportedMNOCheckChannel> = {
  ezy: "ezypesa",
};

export const resolveMnoNamecheckChannel = (
  channelProvider?: string | null
): SupportedMNOCheckChannel | undefined => {
  if (!channelProvider) {
    return undefined;
  }

  const prefix = channelProvider.split("_")[0]?.toLowerCase();
  if (!prefix) {
    return undefined;
  }

  const resolved = (MNO_NAMECHECK_CHANNEL_ALIASES[prefix] ||
    prefix) as SupportedMNOCheckChannel;

  return supportedMNONameChecks.includes(resolved) ? resolved : undefined;
};
