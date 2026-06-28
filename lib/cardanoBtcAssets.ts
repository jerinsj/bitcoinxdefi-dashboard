export const cardanoBtcAssets = [
  {
    symbol: "rsBTC",
    logo: "/icons/rosen.png",
    name: "Rosen Bitcoin",
    policyId: "2dbc49f682ad21f6d18705cf446f9f7a277731ab70ae21a454f888b2",
    assetNameHex: "7273425443",
    decimals: 8,
    source: "Rosen Bridge",
    trackingMethod: "holderAdjusted",
  },
  {
    symbol: "wanBTC",
    logo: "/icons/wanchain.png",
    name: "Wanchain Bitcoin",
    policyId: "25c5de5f5b286073c593edfd77b48abc7a48e5a4f3d4cd9d428ff935",
    assetNameHex: "425443",
    decimals: 8,
    source: "Wanchain",
    trackingMethod: "assetSupply",
  },
] as const;
