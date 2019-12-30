<template>
  <div class="container container--page">
    <h1 class="page-heading">Login</h1>

    <div class="flex justify-between items-center">
      <p class="my-2">An account allows you to create your own card packs and start games.</p>
      <button v-show="me != undefined" @click="logout" class="button">Logout</button>
    </div>
    <div class="mt-4 flex">
      <label for="email" class="w-3/12">E-Mail</label>
      <input id="email" type="email" v-model="email" class="textinput w-9/12" />
    </div>
    <div class="mt-2 flex">
      <label for="password" class="w-3/12">Password</label>
      <input id="password" type="password" v-model="password" class="textinput w-9/12" />
    </div>
    <div class="mt-4">
      <button @click="login" class="button mx-1">Login</button>
      <button @click="register" class="button mx-1">Register</button>
    </div>
    <p class="text-red-500 ml-1 mt-2">{{ message }}</p>
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
  },
  asyncData({ query }) {
    return {
      redirect: query.redirect || '/packs'
    }
  },
  data() {
    return {
      password: '',
      email: 'email@1.test',
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
      await this.$apollo.queries.me.refetch()
      this.$router.push(this.redirect)
    },
    async logout() {
      await this.$apolloHelpers.onLogout()
    },
    async register() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!, $email: String!, $password: String!) {
            register(name: $name, email: $email, password: $password) {
              token
            }
          }
        `,
        variables: {
          name: this.email,
          email: this.email,
          password: this.password
        }
      })

      if (response.data.register === null) {
        this.message = 'Account already exists'
        return
      }
      await this.$apolloHelpers.onLogin(response.data.register.token)
      await this.$apollo.queries.me.refetch()
      this.$router.push(this.redirect)
    }
  }
}
</script>
