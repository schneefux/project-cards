<template>
  <div class="flex flex-col min-h-screen">
    <nav
      class="bg-white border-b-gradient px-4 md:pt-4 flex justify-between items-center flex-wrap sticky top-0 md:static z-50"
    >
      <div class="flex-shrink-0 pt-3 md:py-0 w-full md:w-auto">
        <nuxt-link to="/" class="font-bold text-xl tracking-tighter nav-link">[Project Name]</nuxt-link>
        <div class="md:hidden float-right mt-1">
          <nuxt-link
            v-if="me != undefined"
            to="/login"
            class="px-2 py-1 border rounded-sm nav-link"
          >{{ me.name }}</nuxt-link>
        </div>
      </div>
      <div class="w-full md:w-auto">
        <div class="overflow-x-auto overflow-y-hidden scrolling-touch whitespace-no-wrap">
          <div class="py-2 md:py-0 font-medium">
            <nuxt-link to="/" class="inline mr-4 font-medium nav-link">Home</nuxt-link>
            <nuxt-link v-show="me != undefined" to="/packs" class="inline mr-4 nav-link">Packs</nuxt-link>
            <nuxt-link v-show="me != undefined" to="/games" class="inline mr-4 nav-link">Live Games</nuxt-link>
            <nuxt-link v-show="me == undefined" to="/login" class="inline mr-4 nav-link">Login</nuxt-link>
            <div class="hidden md:inline-block">
              <nuxt-link v-if="me != undefined" to="/login" class="inline nav-link">{{ me.name }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt class="flex-grow" />

    <footer class="bg-gray-100 py-2 text-sm text-gray-600 text-center leading-normal">
      <p>Copyright goes here</p>
      <p class="text-xs leading-tight">Disclaimer goes here</p>
    </footer>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    me: gql`
      query {
        me {
          name
        }
      }
    `
  }
}
</script>

<style scoped>
.nav-link {
  @apply text-gray-700;
}

.nav-link:hover {
  @apply text-primary-600;
}

.border-b-gradient:after {
  content: '';
  background: linear-gradient(
    to right,
    theme('colors.primary.500') 0%,
    theme('colors.primary.300') 100%
  );
  margin-left: -1rem;
  margin-right: -1rem;
  margin-top: 0.75rem;
  height: 2px;
  width: 100vw;
}
</style>
