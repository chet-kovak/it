<template>
  <div class="block">
    <img src="~/@/assets/logo.svg" class="mb-2 logo" />
    <h2 class="mb-4">ITERATION SYNDICATE</h2>
    <p class="mb-6">Acquire $ITS</p>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="mb-4">
        <div class="input d-block mb-4"> 
          <div class="row">
            <img src="~/@/assets/ETH.png" height="16px" class="eth-img" alt=""> 
            <p class="no-marg-l">Etherium</p></div></div>
        <input
          type="number"
          class="input mb-4"
          placeholder="Quantity"
          step="0.001"
          v-model="form.quantity"
        />
        <div class="d-flex">
         
          
        </div>
      </div>
      <button
        v-if="settings.address"
        :disabled="!isValid"
        type="submit"
        class="button button-primary mb-2"
      >
        Acquire
      </button>
      <a v-else class="button button-primary mb-2" @click="modalLoginOpen = true">Connect wallet</a>
    </form>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
    <ModalMakepotion
      v-if="isValid"
      :open="modalMakepotionOpen"
      :form="form"
      @close="modalMakepotionOpen = false"
    />
    <div class="block2">
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
      form: {
        asset: '',
        quantity: '',
        strike: '',
        expiry: ''
      },
      modalLoginOpen: false,
      modalMakepotionOpen: false
    };
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      return (
        this.form.asset && parseFloat(this.form.quantity) && this.form.strike && this.form.expiry
      );
    },
    maxStrike() {
      const exchangeRate = this.settings.exchangeRates[this.form.asset];
      return exchangeRate && exchangeRate.usd ? exchangeRate.usd : 1e9;
    }
  },
  methods: {
    handleSubmit() {
      this.modalMakepotionOpen = true;
    }
  }
};
</script>
