import { ethers } from 'ethers';

let provider;

// @ts-ignore
if (typeof window.ethereum !== 'undefined') {
  const ethereum = window['ethereum'];
  provider = new ethers.providers.Web3Provider(ethereum);
  if(!provider)
    provider = new ethers.providers.InfuraProvider('mainnet', 'd9cfa420001b4d6a9ab961286b8e7ff7');
}

export default provider;
