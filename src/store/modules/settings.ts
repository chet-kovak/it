import Vue from 'vue';
import { ethers } from 'ethers';
import store from '@/store';
import provider from '@/helpers/provider';
import {
  getExchangeRatesFromCoinGecko,
  getAllowances,
} from '@/helpers/utils';
import assets from '@/helpers/assets.json';
import { abi as ierc20Abi } from '@/helpers/abi/IERC20.json';
import { abi as itsAbi } from '@/helpers/abi/its.json';

const parseEther = ethers.utils.parseEther;

const ethereum = window['ethereum'];
if (ethereum) {
  ethereum.on('accountsChanged', () => store.dispatch('init'));
  ethereum.on('networkChanged', network => {
    store.commit('set', { network: ethers.utils.getNetwork(parseInt(network)) });
  });
}

const state = {
  loading: false,
  address: null,
  itsAddr: '0xC32cC5b70BEe4bd54Aa62B9Aefb91346d18821C4',
  itsPairAddr: '0x24d9f6a1575a1eb774e6d7f4281a4b7af5111b75',
  wethAddr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  liquidityLockDivisor: 100,
  callerRewardDivisor: 25,
  rebalanceDivisor: 50,
  name: '',
  balance: 0,
  itsBalance: 0,
  ethPairBalance: 0,
  itsPairBalance: 0,
  itsPrice: 0,
  nextRebalance: 0,
  network: {},
  exchangeRates: {},
  allowances: {},
  balances: {}
};

const mutations = {
  set(_state, payload) {
    Object.keys(payload).forEach(key => {
      Vue.set(_state, key, payload[key]);
    });
  }
};

const actions = {
  init: async ({ commit, dispatch }) => {
    commit('set', { loading: true });
    await dispatch('getExchangeRates');
    if (provider) {
      try {
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        if (address) await dispatch('login');
      } catch (e) {
        console.log(e);
      }
    }
    commit('set', { loading: false });
  },
  login: async ({ commit, dispatch }) => {
    if (provider) {
      try {
        await ethereum.enable();
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const name = await provider.lookupAddress(address);
        const balance = await provider.getBalance(address);
        const network = await provider.getNetwork();
        commit('set', { address });
        //initialize ether price
        await dispatch('loadBalanceIn'); 
        await dispatch('loadITSBalance');
        await dispatch('loadITSEthPrice');
        //get contract balance
        commit('set', {
          name,
          balance: ethers.utils.formatEther(balance),
          network,
          loading: false
        });
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('This website require MetaMask');
    }
  },
  loading: ({ commit }, payload) => {
    commit('set', { loading: payload });
  },
  async getExchangeRates({ commit }) {
    const exchangeRates = await getExchangeRatesFromCoinGecko();
    commit('set', { exchangeRates });
  },
  async loadBalanceIn({ commit }) {
    const itsToken = await new ethers.Contract(state.itsAddr, ierc20Abi, provider);
    const balance = await itsToken.balanceOf(state.address);
    const balances = state.balances;
    balances[state.itsAddr] = parseFloat(ethers.utils.formatEther(balance));
    commit('set', { balances });
  }, 

  async rebalance({ commit }) {
    const itsToken = await new ethers.Contract(state.itsAddr, itsAbi, provider);
    const signer = provider.getSigner();
    const itsTokenWithSigner = itsToken.connect(signer)
    await itsTokenWithSigner.rebalanceLiquidity();
  },
  async loadITSBalance({ commit }) {
    const itsToken = await new ethers.Contract(state.itsAddr, ierc20Abi, provider);
    const itsBalance = await itsToken.balanceOf(state.itsAddr);
    commit('set', { itsBalance: ethers.utils.formatEther(itsBalance) });
  },

  async loadITSEthPrice({ commit }) {
    const wethContract = await new ethers.Contract(state.wethAddr, ierc20Abi, provider);
    const itsContract = await new ethers.Contract(state.itsAddr, ierc20Abi, provider);
    const wethBal = await wethContract.balanceOf(state.itsPairAddr);
    const itsBal = await itsContract.balanceOf(state.itsPairAddr);
    const itsPrice = wethBal/itsBal;
    commit('set', { 
                      itsPrice: itsPrice.toFixed(6),
                      ethPairBalance: ethers.utils.formatEther(wethBal),
                      itsPairBalance: ethers.utils.formatEther(itsBal),
                  });
  },
  async loadFees({ commit }) {
    const itsContract = await new ethers.Contract(state.itsAddr, itsAbi, provider);
    const liquidityLockDivisor = await itsContract.liquidityLockDivisor();
    const callerRewardDivisor = await itsContract.callerRewardDivisor();
    const rebalanceDivisor = await itsContract.rebalanceDivisor();
    commit('set', { 
                    liquidityLockDivisor: 100/liquidityLockDivisor, 
                    callerRewardDivisor: 100/callerRewardDivisor, 
                    rebalanceDivisor: 100/rebalanceDivisor
                  })
  },
  async getNextRebalance({commit}) {
    const itsContract = await new ethers.Contract(state.itsAddr, itsAbi, provider);
    const lastRebalance = await itsContract.lastRebalance();
    const rebalanceInterval = await itsContract.rebalanceInterval();

    const nextRebalance = (parseInt(lastRebalance) + parseInt(rebalanceInterval)) * 1000;
    commit('set', {nextRebalance});
  }
};

export default {
  state,
  mutations,
  actions
};
