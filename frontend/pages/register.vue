<template>
  <div class="container container--page">
    <h1 class="page-heading">Register</h1>

    <div>
      <p class="mt-2">An account allows you to create your own card packs and start games.</p>
      <p class="mt-2">
        Already have an account?
        <nuxt-link
          :to="'/login' + (redirect != undefined ? `?redirect=${redirect}` : '')"
          class="ml-1 button button--sm"
        >Go to Login</nuxt-link>
      </p>
    </div>

    <form @submit.prevent="register">
      <div class="mt-6 flex">
        <label for="name" class="w-3/12">Nickname</label>
        <input id="name" type="username" required v-model="name" class="textinput w-9/12" />
      </div>
      <div class="mt-2 flex">
        <label for="email" class="w-3/12">E-Mail</label>
        <input id="email" type="email" required v-model="email" class="textinput w-9/12" />
      </div>
      <div class="mt-2 flex">
        <label for="password" class="w-3/12">Password</label>
        <input id="password" type="password" required v-model="password" class="textinput w-9/12" />
      </div>
      <div class="mt-6">
        <button type="submit" class="button button--secondary button--lg">Register</button>
      </div>
      <p class="text-red-500 ml-1 mt-2">{{ message }}</p>
    </form>
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
        }
      }
    `
  },
  asyncData({ query }) {
    return {
      redirect: query.redirect
    }
  },
  data() {
    return {
      password: '',
      email: '',
      name: '',
      message: ''
    }
  },
  methods: {
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
          name: this.name,
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
      this.$router.push(this.redirect || '/packs')
    }
  },
  created() {
    if (this.me != undefined) {
      this.name = this.me.name.replace(' (Guest)', '')
    }
  }
}
</script>
