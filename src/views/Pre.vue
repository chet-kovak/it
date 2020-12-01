<template>
  <div class="block">
    <img src="~/@/assets/logo.svg" class="mb-2 logo" />
    <h2 class="mb-4">ITERATION REBALANCE</h2>
    <p class="mb-6">Rebalance The Syndicate</p>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="mb-4">
        <h3>{{settings.itsPrice}} ITS / ETH</h3>
        <h3>{{settings.itsBalance.substr(0,10)}} ITS</h3>
      </div>
      <button
        v-if="settings.address"
        :disabled="!isValid"
        type="submit"
        class="button button-primary mb-2"
      >
        Rebalance
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
      }.bind(this), 10000);
  },
  computed: {
    ...mapState(['settings']),
    isValid() {
      console.log(Date.now())
      console.log(this.nextRebalance)
      return ( //Valid if lastcall + interval > now
        Date.now() > this.nextRebalance
      );
    },

  },
  methods: {
    ...mapActions(['getNextRebalance', 'rebalance']),
    handleSubmit() {
      this.rebalance();
    }
  }
};
</script>
