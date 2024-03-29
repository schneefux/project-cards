<template>
  <div class="flex flex-col min-h-screen">
    <nav
      class="bg-white border-b-gradient px-4 md:pt-4 flex justify-between items-center flex-wrap sticky top-0 md:static z-50"
    >
      <div class="flex-shrink-0 pt-3 md:py-0 w-full md:w-auto">
        <nuxt-link to="/" class="font-bold text-xl tracking-tighter nav-link">[Projektname]</nuxt-link>
        <div class="md:hidden float-right mt-1">
          <nuxt-link
            v-if="me != undefined"
            :to="me.subscriptionTier == 'GUEST' ? '/register' : '/account'"
            class="px-2 py-1 border rounded-sm nav-link"
          >{{ me.name }}</nuxt-link>
        </div>
      </div>
      <div class="menu w-full md:w-auto">
        <div class="overflow-x-auto overflow-y-hidden scrolling-touch whitespace-no-wrap">
          <div class="py-2 md:py-0 font-medium">
            <nuxt-link
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              :exact="link.exact"
              class="inline mr-4 font-medium nav-link"
            >{{ link.title }}</nuxt-link>
            <div class="hidden md:inline-block">
              <nuxt-link
                v-if="me != undefined"
                :to="me.subscriptionTier == 'GUEST' ? '/register' : '/account'"
                class="inline nav-link"
              >{{ me.name }}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <nuxt class="flex-grow" />

    <footer class="bg-gray-100 py-2 text-sm text-gray-600 text-center leading-normal">
      <p>Todo</p>
      <p class="text-xs leading-tight">Disclaimer</p>
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
          subscriptionTier
        }
      }
    `
  },
  computed: {
    links() {
      if (this.me == null) {
        return [
          {
            to: '/',
            title: 'Startseite',
            exact: true
          },
          {
            to: '/packs',
            title: 'Karten'
          },
          {
            to: '/login',
            title: 'Login'
          }
        ]
      }

      switch (this.me.subscriptionTier) {
        case 'GUEST':
          return [
            {
              to: '/',
              title: 'Startseite',
              exact: true
            },
            {
              to: '/packs',
              title: 'Karten'
            }
          ]

        case 'FREE':
          return [
            {
              to: '/',
              title: 'Startseite',
              exact: true
            },
            {
              to: '/packs',
              title: 'Karten'
            },
            {
              to: '/games',
              title: 'Spiele'
            }
          ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.nav-link {
  @apply text-gray-700;

  &:hover {
    @apply text-primary-600;
  }
}

.menu {
  .nuxt-link-active {
    @apply text-secondary-600;

    &:hover {
      @apply text-primary-600;
    }
  }
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
