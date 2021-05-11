<template>
  <div id="app" class="overflow-hidden pb-6">
    <VueLoadingIndicator v-if="settings.loading" class="overlay big" />
    <div class="stuff" v-else>
      <Nav />
      <router-view :key="$route.path" />
      <div class="full">
      <div class="social1 circle-out"><a target="_blank" href="https://cryptochoad.medium.com/iteration-syndicate-d0bde4b0e384"><img src="./assets/medium.png" alt=""></a></div>
      <div class="social2 circle-out"><a target="_blank" href="https://twitter.com/rena_finance"><img src="./assets/twitter.png" alt=""></a></div>
      <div class="social3 circle-out"><a target="_blank" href="https://t.me/RenascentDefi"><img src="./assets/telegram.png" alt=""></a></div>
      <div class="social4 circle-out"><a target="_blank" href="https://etherscan.io/token/0xC32cC5b70BEe4bd54Aa62B9Aefb91346d18821C4"><img src="./assets/etherscan.png" alt=""></a></div>
      </div>
      <vue-particles
        class="vue-particles"
        color="#dedede"
        :particleOpacity="0.8"
        :particlesNumber="50"
        shapeType="circle"
        :particleSize="0"
        linesColor="#222"
        :linesWidth="0.5"
        :lineLinked="true"
        :lineOpacity="0.8"
        :linesDistance="100"
        :moveSpeed="50"
        :hoverEffect="false"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles>
    </div>
 </div>
</template>
<script src="https://cpwebassets.sfo2.cdn.digitaloceanspaces.com/assets/common/stopExecutionOnTimeout-157cd5b220a5c80d4ff8e0e70ac069bffd87a61252088146915e8726e5d9f147.js"></script>
<script>
import { mapState, mapActions } from 'vuex';

export default {
  computed: {
    ...mapState(['settings'])
  },
  methods: {
    ...mapActions(['init'])
  },
  async created() {
    this.init();
  }
};
</script>
