<template>
  <div v-if="trumpPack != undefined" class="container container--page">
    <h1 class="page-heading">Play "{{ trumpPack.name }}"</h1>

    <form @submit.prevent="startGoofenspiel" class="mt-2 flex flex-wrap">
      <label class="w-full">
        Select opponent:
        <select v-model="opponent" required class="textinput">
          <option v-for="user in users" :key="user.id" :value="user.id">{{ user.name }}</option>
        </select>
      </label>
      <div class="w-full my-2">
        <button type="submit" class="button button--secondary">Start Goofenspiel</button>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    // TODO restrict this by using a search or invite links
    users: gql`
      query {
        users {
          id
          name
        }
      }
    `,
    trumpPack: {
      query: gql`
        query($trumpPackId: ID!) {
          trumpPack(where: { id: $trumpPackId }) {
            name
          }
        }
      `,
      variables() {
        return {
          trumpPackId: this.trumpPackId
        }
      }
    }
  },
  asyncData({ params }) {
    return {
      trumpPackId: params.pack
    }
  },
  data() {
    return {
      opponent: undefined
    }
  },
  methods: {
    async startGoofenspiel() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($pack: ID!, $opponent: ID!) {
            startGoofenspiel(pack: $pack, opponent: $opponent)
          }
        `,
        variables: {
          pack: this.trumpPackId,
          opponent: this.opponent
        }
      })

      const gameId = response.data.startGoofenspiel
      this.$router.push(`/games/${gameId}`)
    }
  }
}
</script>
