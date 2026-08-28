# Wallet Connect Test

A small React app that connects to an EVM wallet (MetaMask or similar), shows the connected address and network, and stays in sync as the user switches accounts, switches networks, or disconnects.

**Live demo:** https://sbnn3.github.io/wallet-connect-test/

## What it does

- "Connect Wallet" button that requests access to the user's wallet
- Shows the connected address once approved, with a one-click copy button
- Shows the current network (Ethereum, Polygon, BNB Chain, Arbitrum, Optimism, Avalanche, and their main testnets) with a colored status dot
- Remembers an already-authorized session, so returning users are reconnected automatically on page load, without a new wallet popup
- Updates the address if the user switches accounts, and clears the connection if the wallet is locked, disconnected, or all accounts are removed
- "Disconnect" button that resets the app's own connection state
- Clear error messages for the two main failure cases: no wallet installed, and the user rejecting the connection request

## Stack

- React + Vite
- ethers.js v6 for talking to the wallet
- Vitest + React Testing Library for tests
- GitHub Actions for CI (lint, test, build on every push)

## Running it locally

```bash
npm install
npm run dev
```

Open the app in a browser with MetaMask (or another EVM wallet extension) installed.

## Testing

```bash
npm run test   # run the test suite once
npm run lint   # check code style
npm run build  # production build
```

Tests cover the address/network formatting helpers and the connection logic in `useWallet` (connecting, a rejected request, restoring an existing session, and disconnecting), including mocked wallet responses so nothing here needs a real browser extension to run.

## Project structure

```
src/
  components/WalletConnect.jsx   UI only
  components/WalletConnect.css
  hooks/useWallet.js             all wallet/connection logic and state
  hooks/useWallet.test.jsx
  lib/formatAddress.js           address shortening helper
  lib/networks.js                chain id -> name/color mapping
  lib/*.test.js
```

The UI and the wallet logic are split on purpose, so either one can change without touching the other, and the logic can be tested without rendering anything.

## Notes

- "Disconnect" only resets the app's local state, since a website can't fully disconnect a wallet extension on its own. To fully disconnect, the user would do it from the wallet itself.
- Any chain not in the known list still works, it just shows as "Unknown network (chain X)" with a neutral color.
- Deployed to GitHub Pages with `npm run deploy` (`gh-pages` pushes the production build to the `gh-pages` branch).
