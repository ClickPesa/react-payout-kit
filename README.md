# @clickpesa/react-payout-kit

Shared React payout destination fields and utilities for ClickPesa apps.

## Install

```json
"@clickpesa/react-payout-kit": "github:ClickPesa/react-payout-kit"
```

## Usage

```tsx
import { PayoutDestinationFields, getMNOChannel } from "@clickpesa/react-payout-kit";

<PayoutDestinationFields
  form={form}
  theme="light"
  fetchBanks={() => getBanks("tanzania")}
  verifyName={payoutBankNameCheck}
/>
```

## Build

```bash
yarn build
```

Commit `dist/` before pushing (same pattern as `tanzanian-phone-validator`).
