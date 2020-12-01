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
  itsAddr: '0x1a476b75c780e9d51a488380d48c744589b5b45a',
  itsPairAddr: '0x56c8b97d17f518c947da3e9c9ca4cb10d65558a0',
  wethAddr: '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6',

  name: '',
  balance: 0,
  itsBalance: 0,
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
  async loadBalanceIn({ commit }, payload) {
    const itsToken = await new ethers.Contract(payload, ierc20Abi, provider);
    const balance = await itsToken.balanceOf(state.address);
    const balances = state.balances;
    balances[payload] = parseFloat(ethers.utils.formatEther(balance));
    commit('set', { balances });
  }, 

  async rebalance({ commit }) {
    const itsToken = await new ethers.Contract(state.itsAddr, itsAbi, provider);
    const signer = provider.getSigner();
    const itsTokenWithSigner = itsToken.connect(signer)
    await itsTokenWithSigner.rebalanceLiquidity();
  },
  async resetStats({commit}) {
    console.log("Happened");
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
    const itsPrice = itsBal/wethBal;
    commit('set', { itsPrice: itsPrice.toFixed(4)});
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
