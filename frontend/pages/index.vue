<template>
  <div>
    <div class="py-20 bg-gradient-r-secondary-to-light">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold mb-2 text-white">[Project Name]</h2>
        <h3 class="text-2xl mb-8 text-gray-100">Design, play and print custom card games.</h3>

        <nuxt-link
          to="/games"
          class="bg-white hover:bg-secondary-100 font-bold rounded-full py-4 px-8 shadow-lg uppercase tracking-wider"
        >Play Online</nuxt-link>
      </div>
    </div>

    <section class="container mx-auto px-6 p-10">
      <h2 class="text-4xl font-bold text-center text-gray-800 mb-8">Features</h2>

      <div class="feature">
        <div class="w-full md:w-1/2">
          <h4 class="feature__heading">Card Designer</h4>
          <p class="feature__text">Create Trump-style playing cards with custom images and text.</p>
        </div>
        <div class="w-full md:w-1/2">
          <img src="~assets/images/playing-cards.svg" alt="playing cards" />
        </div>
      </div>

      <div class="feature">
        <div class="w-full md:w-1/2">
          <img src="~assets/images/game-day.svg" alt="game day" />
        </div>
        <div class="w-full md:w-1/2 pl-10">
          <h4 class="feature__heading">Online Battles</h4>
          <p
            class="feature__text"
          >Challenge friends or strangers and play "Goofenspiel", the Game of Pure Strategy with cards created by you or the community.</p>
        </div>
      </div>

      <div class="feature">
        <div class="w-full md:w-1/2 pl-10">
          <h4 class="feature__heading">Print at Home</h4>
          <p class="feature__text">Print card games and play offline.</p>
        </div>
        <div class="w-full md:w-1/2">
          <img src="~assets/images/print-invoice.svg" alt="print invoice" />
        </div>
      </div>
    </section>

    <section class="bg-primary-500">
      <div class="container mx-auto px-6 text-center py-20">
        <h2 class="mb-6 text-4xl font-bold text-center text-white">Try it for free</h2>
        <h3 class="my-4 text-2xl text-white">Create your first card pack</h3>
        <nuxt-link
          to="/login"
          class="bg-white hover:bg-primary-100 font-bold rounded-full mt-6 py-4 px-8 shadow-lg uppercase tracking-wider inline-block"
        >Sign Up</nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {}
</script>

<style scoped>
.feature {
  @apply flex items-center flex-wrap mb-20;
}

.feature__heading {
  @apply text-3xl text-gray-800 font-bold mb-3;
}

.feature__text {
  @apply text-gray-600 mb-8;
}
</style>
