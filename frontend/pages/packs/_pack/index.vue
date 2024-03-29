<template>
  <div v-if="trumpPack != undefined" class="container container--page">
    <h1 class="page-heading">
      Kartenspiel
      <span class="text-primary-700">{{ trumpPack.name }}</span>
      von
      <span class="text-gray-700">{{ trumpPack.author.name }}</span>
    </h1>

    <div class="flex flex-wrap">
      <p
        v-if="!enoughCardsToPlay"
        class="mb-2 text-gray-800 text-sm w-full"
      >Füge mehr Karten hinzu, um spielen zu können.</p>
      <button
        v-if="me != undefined && me.subscriptionTier != 'GUEST'"
        @click="enoughCardsToPlay ? createGoofenspiel : null"
        class="button button--secondary button--lg shadow-md float-left my-2 ml-4 mr-6"
        :class="{ 'button--disabled': !enoughCardsToPlay }"
      >Spiel starten</button>
      <div v-else class="block">
        <p>Mit einem kostenlosen Account kannst du dieses Spiel starten.</p>
        <div class="mt-4 mb-6">
          <nuxt-link :to="currentRoute" class="button button--lg button--secondary">Registrieren</nuxt-link>
          <nuxt-link to="/games" class="ml-2 button button--lg">Bereits gestartete Spiele sehen</nuxt-link>
        </div>
      </div>
      <p class="flex items-center">{{ trumpPack.description }}</p>
    </div>

    <div class="mt-8">
      <h2 class="page-subheading">Karten ({{ trumpPack.cards.length }})</h2>

      <div class="flex flex-wrap">
        <nuxt-link
          v-if="me != undefined && trumpPack.author.id == me.id"
          :to="`/packs/${trumpPack.id}/new`"
          class="playingcard playingcard--interactive"
        >
          <div class="playingcard__container playingcard__container--md">
            <div class="w-full h-full flex flex-wrap justify-center items-center">
              <div class="button button--secondary button--fab-lg">
                <PlusIcon class="button__icon" />
              </div>
              <p class="w-full text-center text-lg">Neu</p>
            </div>
          </div>
        </nuxt-link>

        <div
          v-for="card in trumpPack.cards"
          :key="card.id"
          class="playingcard playingcard--interactive"
        >
          <div class="playingcard__container playingcard__container--md">
            <p class="playingcard__title">{{ card.name }}</p>
            <div class="playingcard__image boxedimage">
              <div class="boxedimage__container">
                <img class="boxedimage__image" :src="imagesRoot + card.imageUrl" />
              </div>
            </div>
            <table class="playingcard__attributes">{{ card.description }}</table>

            <button
              v-if="me != undefined && trumpPack.author.id == me.id"
              class="absolute bottom-0 left-0 ml-2 mb-2 button button--fab-sm"
            >
              <BinIcon class="button__icon" />
            </button>
            <p class="playingcard__attribution">erstellt von {{ trumpPack.author.name }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlusIcon from 'ikonate/icons/plus.svg'
import BinIcon from 'ikonate/icons/bin.svg'
import gql from 'graphql-tag'

export default {
  apollo: {
    me: gql`
      query {
        me {
          id
          subscriptionTier
        }
      }
    `,
    trumpPack: {
      query: gql`
        query($trumpPackId: ID!) {
          trumpPack(where: { id: $trumpPackId }) {
            id
            name
            description
            author {
              id
              name
            }
            cards {
              id
              name
              imageUrl
              description
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
  components: {
    PlusIcon,
    BinIcon
  },
  computed: {
    currentRoute() {
      return this.$router.currentRoute
    },
    enoughCardsToPlay() {
      return this.trumpPack.cards.length > 3
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
