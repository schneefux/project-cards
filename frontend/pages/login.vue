<template>
  <div class="container container--page">
    <h1 class="page-heading">Login</h1>

    <div>
      <p class="mt-2">
        Don't have an account?
        <nuxt-link
          :to="'/register' + (redirect != undefined ? `?redirect=${redirect}` : '')"
          class="ml-1 button button--sm"
        >Go to Registration</nuxt-link>
      </p>
    </div>

    <form @submit.prevent="login">
      <div class="mt-4 flex">
        <label for="email" class="w-2/12">E-Mail</label>
        <input id="email" type="email" required v-model="email" class="textinput w-10/12" />
      </div>
      <div class="mt-2 flex">
        <label for="password" class="w-2/12">Password</label>
        <input id="password" type="password" required v-model="password" class="textinput w-10/12" />
      </div>
      <div class="mt-4">
        <button type="submit" class="button button--secondary button--lg">Login</button>
      </div>
      <p class="text-red-500 ml-1 mt-2">{{ message }}</p>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  asyncData({ query }) {
    return {
      redirect: query.redirect || '/packs'
    }
  },
  data() {
    return {
      password: '',
      email: '',
      message: ''
    }
  },
  methods: {
    async login() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($email: String!, $password: String!) {
            login(email: $email, password: $password) {
              token
            }
          }
        `,
        variables: {
          email: this.email,
          password: this.password
        }
      })

      if (response.data.login === null) {
        this.message = 'Invalid credentials'
        return
      }
      await this.$apolloHelpers.onLogin(response.data.login.token)
      this.$router.push(this.redirect || '/packs')
    }
  }
}
</script>
