<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex
      xs12
      sm8
      md6
    >
      {{ trumpPacks }}
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'
import gql from 'graphql-tag'

export default {
  apollo: {
    trumpPacks: {
      query: gql`query {
        trumpPacks {
          name
        }
      }`
    }
  },
  components: {
    Logo,
    VuetifyLogo
  }
}
</script>
