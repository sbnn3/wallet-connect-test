# Wallet Connect Test

A small React app that connects to an EVM wallet (MetaMask or similar) and shows the connected address and network.

## What it does

- "Connect Wallet" button that requests access to the user's wallet
- Shows the connected address once the user approves
- Shows the current network (Ethereum, Polygon, etc.) and updates it if the user switches networks
- Updates the address if the user switches accounts, and clears the connection if the wallet is locked or all accounts are removed
- "Disconnect" button that resets the app's own connection state
- Clear error messages for the two main failure cases: no wallet installed, and the user rejecting the connection request

## Stack

- React + Vite
- ethers.js v6 for talking to the wallet

## Running it locally

```bash
npm install
npm run dev
```

Then open the app in a browser that has MetaMask (or another EVM wallet extension) installed.

## Notes

- Network names are mapped for the common EVM chains (Ethereum, Polygon, BNB Chain, Arbitrum, Optimism, Avalanche, and their main testnets). Any other chain still works, it just shows as "Unknown network (chain X)".
- The wallet logic lives in `src/hooks/useWallet.js`, kept separate from the UI in `src/components/WalletConnect.jsx` so the two can be tested and changed independently.
- "Disconnect" only resets the app's local state, since MetaMask doesn't expose a way for a website to fully disconnect a wallet on its own. To fully disconnect, the user would do it from the wallet extension itself.
