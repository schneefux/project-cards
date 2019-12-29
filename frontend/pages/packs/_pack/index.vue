<template>
  <div v-if="trumpPack != undefined" class="container container--page">
    <h1 class="page-heading">Pack "{{ trumpPack.name }}"</h1>
    <button
      @click="createGoofenspiel"
      class="button button--secondary button--lg shadow-md float-left my-2 ml-4 mr-6"
    >Start Game</button>
    <p>Description: {{ trumpPack.description }}</p>
    <p>Author: {{ trumpPack.author.name }}</p>

    <div class="mt-4">
      <h2 class="page-subheading">Cards ({{ trumpPack.cards.length }})</h2>

      <div class="flex flex-wrap">
        <nuxt-link
          :to="`/packs/${trumpPack.id}/new`"
          class="playingcard playingcard--md playingcard--interactive"
        >
          <div class="playingcard__container">
            <div class="w-full h-full flex flex-wrap justify-center items-center">
              <div class="button button--secondary button--round h-16 w-16 flex">
                <span class="text-4xl font-bold leading-none mx-auto mt-1">+</span>
              </div>
              <p class="w-full text-center text-lg">Create New</p>
            </div>
          </div>
        </nuxt-link>

        <div
          v-for="card in trumpPack.cards"
          :key="card.id"
          class="playingcard playingcard--md playingcard--interactive"
        >
          <div class="playingcard__container">
            <p class="playingcard__title">{{ card.name }}</p>
            <div class="playingcard__image boxedimage">
              <div class="boxedimage__container">
                <img class="boxedimage__image" :src="imagesRoot + card.imageUrl" />
              </div>
            </div>
            <table class="playingcard__attributes">
              <tr v-for="attributeValue in card.attributeValues" :key="attributeValue.id">
                <td>{{ attributeValue.attribute.name }}</td>
                <td>{{ attributeValue.value }}</td>
              </tr>
            </table>

            <p class="playingcard__attribution">created by {{ trumpPack.author.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    trumpPack: {
      query: gql`
        query($trumpPackId: ID!) {
          trumpPack(where: { id: $trumpPackId }) {
            id
            name
            author {
              name
            }
            cards {
              id
              name
              imageUrl
              attributeValues {
                id
                value
                attribute {
                  id
                  name
                  aimHigh
                }
              }
            }
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
      imagesRoot: process.env.imagesRoot
    }
  },
  methods: {
    async createGoofenspiel() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($pack: ID!) {
            createGoofenspiel(pack: $pack)
          }
        `,
        variables: {
          pack: this.trumpPackId
        }
      })

      const gameId = response.data.createGoofenspiel
      this.$router.push(`/games/${gameId}`)
    }
  }
}
</script>
