<template>
  <div class="container container--page">
    <form @submit.prevent="registerGuest" class="mt-6 text-center">
      <p class="mb-4">Choose a nickname to play games.</p>
      <label for="username" class="mr-1">Nickname</label>
      <input id="username" type="username" v-model="username" required class="textinput" />
      <button type="submit" class="button button--secondary ml-3">Go</button>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  asyncData({ query }) {
    return {
      redirect: query.redirect
    }
  },
  data() {
    return {
      username: ''
    }
  },
  methods: {
    async registerGuest() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!) {
            registerGuest(name: $name) {
              token
            }
          }
        `,
        variables: {
          name: this.username
        }
      })

      await this.$apolloHelpers.onLogin(response.data.registerGuest.token)
      this.$router.push(this.redirect)
    }
  }
}
</script>
