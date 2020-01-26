<template>
  <div class="container container--page">
    <div class="mx-auto max-w-md card">
      <form @submit.prevent="registerGuest" class="mt-6 text-center">
        <p class="mb-4">Gib einen Spielernamen ein, um spielen zu können.</p>
        <label for="username" class="mr-1">Spielername</label>
        <input id="username" type="username" v-model="username" required class="textinput" />
        <button type="submit" class="button button--secondary ml-3">Los</button>

        <p class="mt-8 mb-4">
          Hast du einen Account?
          <nuxt-link
            :to="'/login' + (redirect != undefined ? `?redirect=${redirect}` : '')"
            class="ml-1 button button--sm"
          >Zum Login</nuxt-link>
        </p>
      </form>
    </div>
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
