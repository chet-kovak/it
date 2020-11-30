<template>
  <div id="app" class="overflow-hidden pb-6">
    <VueLoadingIndicator v-if="settings.loading" class="overlay big" />
    <div v-else>
      <Nav />
      <router-view :key="$route.path" />
      <vue-particles
        class="vue-particles"
        color="#dedede"
        :particleOpacity="0.2"
        :particlesNumber="50"
        shapeType="circle"
        :particleSize="0"
        linesColor="#aaaaaa"
        :linesWidth="1"
        :lineLinked="true"
        :lineOpacity="0.2"
        :linesDistance="250"
        :moveSpeed="100"
        :hoverEffect="false"
        hoverMode="grab"
        :clickEffect="true"
        clickMode="push"
      >
      </vue-particles> 
    </div>
 </div>
</template>

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
