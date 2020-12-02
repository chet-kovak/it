<template>
  <div class="block">
    <img src="~/@/assets/logo.svg" class="mb-2 logo" />
    <h2 class="mb-4">ITERATION SYNDICATE</h2>
    <p class="mb-2">Rebalance $ITS</p>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="mb-4">
        
        <div class="">
        <h3>LP Pair</h3>
        <h3>{{itsPairBalance}} ITS / {{ethPairBalance}} ETH</h3>
        <h3>{{settings.itsPrice}} ETH</h3>
        <h3>LP Reward</h3>
        <h3>{{itsBalance}} ITS</h3>
          <p v-show='!hasBalance'>You need atleast 100 ITS to Rebalance</p>
        </div>
      </div>
      <button
        v-if="settings.address"
        :disabled="!isValid"
        type="submit"
        class="button button-primary mb-2"
      >
        REBALANCE
      </button>
      <a v-else class="button button-primary mb-2" @click="modalLoginOpen = true">Connect wallet</a>
    </form>
    <ModalLogin :open="modalLoginOpen" @close="modalLoginOpen = false" />
    <ModalMakepotion
      v-if="isValid"
      :open="modalMakepotionOpen"
      :form="form"
      @close="modalMakepotionOpen = false"
    />  <div class="block2"></div>

  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      form: {
        quantity: '',
      },
      nextRebalance: Date.now() + 10000,
      modalLoginOpen: false,
      modalMakepotionOpen: false
    };
  },
  async created() {
      await this.getNextRebalance();      
      this.nextRebalance = this.$store.state.settings.nextRebalance;
      setInterval( async function(){
        await this.getNextRebalance();      
        this.nextRebalance = this.$store.state.settings.nextRebalance;
        await this.loadITSBalance();
        await this.loadITSEthPrice();
      }.bind(this), 10000);
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      return ( //Valid if lastcall + interval > now
        Date.now() > this.nextRebalance
      );
    },
    itsPairBalance() {
      if(this.settings.itsPairBalance)
        return this.settings.itsPairBalance.substr(0, 7)
      return 0
    },
    ethPairBalance() {
      if(this.settings.ethPairBalance)
        return this.settings.ethPairBalance.substr(0, 7)
      return 0      
    },
    itsBalance() {
      if(this.settings.itsBalance)
        return this.settings.itsBalance.substr(0, 7)
      return 0      
    },    
    hasBalance() {
      return this.settings.balances[this.settings.itsAddr] >= 100;
    }

  },
  methods: {
    ...mapActions(['getNextRebalance', 'rebalance', 'loadITSBalance', 'loadITSEthPrice']),
    handleSubmit() {
      this.rebalance();
    }
  }
};
</script>
