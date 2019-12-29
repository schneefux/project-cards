<template>
  <div class="flex flex-col min-h-screen">
    <nav
      class="bg-primary-500 px-4 pb-1 md:p-4 flex justify-between items-center flex-wrap sticky top-0 md:static z-50"
    >
      <div class="flex-shrink-0 pt-3 md:py-0 w-full md:w-auto">
        <nuxt-link to="/" class="font-semibold text-xl text-white tracking-tighter">Title Goes Here</nuxt-link>
        <div class="md:hidden float-right mt-1">
          <nuxt-link
            v-if="me != undefined"
            to="/login"
            class="px-2 py-1 border border-primary-200 rounded-sm text-primary-200 hover:bg-primary-600"
          >{{ me.name }}</nuxt-link>
        </div>
      </div>
      <div class="w-full md:w-auto">
        <div class="overflow-x-auto overflow-y-hidden scrolling-touch whitespace-no-wrap">
          <div class="py-2 md:py-0">
            <nuxt-link to="/" class="nav-link">Home</nuxt-link>
            <nuxt-link v-show="me != undefined" to="/packs" class="nav-link">Packs</nuxt-link>
            <nuxt-link v-show="me != undefined" to="/games" class="nav-link">Live Games</nuxt-link>
            <nuxt-link v-show="me == undefined" to="/login" class="nav-link">Login</nuxt-link>
            <div class="hidden md:inline-block">
              <nuxt-link
                v-if="me != undefined"
                to="/login"
                class="inline font-medium border-b border-primary-200 text-primary-200 hover:text-primary-100"
              >{{ me.name }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt class="flex-grow" />

    <footer class="bg-primary-500 py-2 text-sm text-primary-100 text-center leading-normal">
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
  @apply inline mr-4 text-primary-100 border-b border-primary-100 font-medium;
}

.nav-link:hover {
  @apply text-primary-200;
}
</style>
