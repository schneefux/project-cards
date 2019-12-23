<template>
  <div>
    <h1>Login</h1>
    <p>Logged in: {{ loggedIn }}</p>
    <p>{{ message }}</p>
    <div>
      <input type="text" v-model="email" class="border" />
      <input type="text" v-model="password" class="border" />
      <button @click="login" class="border">Login</button>
      <button @click="register" class="border">Register</button>
      <button @click="logout" class="border">Logout</button>
      <p>User ID: {{ (me || {}).id || 'nicht gefunden' }}</p>
    </div>
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
        }
      }
    `
  },
  computed: {
    loggedIn() {
      return !!this.$apolloHelpers.getToken()
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
    }
  }
}
</script>
