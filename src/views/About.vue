<template>
  <div class="block">
    <img src="~/@/assets/logo.svg" class="mb-2 logo" />
    <h2 class="mb-4">About Iteration Syndicate</h2>
    <p class="mb-6">Lorem Ipsum</p>
   
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        potion: ''
      },
      modalWithdrawOpen: false,
      modalLoginOpen: false,
      modalRevitalizeOpen: false,
      potions: this.$store.state.settings.potions
    };
  }
};
</script>
