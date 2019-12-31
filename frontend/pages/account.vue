</script>
<template>
  <div v-if="me != undefined" class="container container--page">
    <h1 class="page-heading">
      Your Account
      <span class="text-gray-700">{{ me.name }}</span>
    </h1>

    <p class="mb-4">E-Mail: {{ me.email }}</p>
    <button @click="logout" class="button">Logout</button>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    me: gql`
      query {
        me {
          id
          name
          email
        }
      }
    `
  },
  methods: {
    async logout() {
      await this.$apolloHelpers.onLogout()
      this.$router.push('/')
    }
  },
  middleware: ['free']
}
</script>
