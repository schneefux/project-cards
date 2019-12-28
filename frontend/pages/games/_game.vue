<template>
  <div v-if="me != undefined && game != undefined" class="container container--page">
    <h1 class="page-heading">Game {{ game.id }}</h1>

    <p>Players: {{ game.hands.map(h => h.player.name).join(', ') }}</p>
    <button
      @click="joinGame"
      v-show="game.hands.length < 2"
      class="button button--secondary mb-1"
    >Join</button>

    <div v-if="pricePile != undefined">
      <p>{{ pricePile.name }}</p>
      <div
        v-for="pileCard in pricePile.pileCards"
        :key="pileCard.id"
        class="playingcard playingcard--md"
      >
        <div class="playingcard__container">
          <p class="playingcard__title">{{ pileCard.card.name }}</p>
          <div class="playingcard__image boxedimage">
            <div class="boxedimage__container">
              <img class="boxedimage__image" :src="imagesRoot + pileCard.card.imageUrl" />
            </div>
          </div>
          <table class="playingcard__attributes">
            <tr v-for="attributeValue in pileCard.card.attributeValues" :key="attributeValue.id">
              <td>{{ attributeValue.attribute.name }}</td>
              <td>{{ attributeValue.value }}</td>
            </tr>
          </table>

          <p class="playingcard__attribution">created by {{ game.pack.author.name }}</p>
        </div>
      </div>

      <p
        class="my-2 text-red-500"
      >{{ myHand.player.name }} ({{ myHand.score }} points - {{ myHand.atTurn ? 'at turn' : 'not at turn' }})</p>

      <div v-for="pile in myHand.piles" :key="pile.id">
        <p>{{ pile.name }}</p>
        <button
          v-for="pileCard in pile.pileCards"
          :key="pileCard.id"
          @click="bidCard(pileCard)"
          class="playingcard playingcard--md playingcard--interactive"
        >
          <div class="playingcard__container">
            <p class="playingcard__title">{{ pileCard.card.name }}</p>
            <div class="playingcard__image boxedimage">
              <div class="boxedimage__container">
                <img class="boxedimage__image" :src="imagesRoot + pileCard.card.imageUrl" />
              </div>
            </div>
            <table class="playingcard__attributes">
              <tr v-for="attributeValue in pileCard.card.attributeValues" :key="attributeValue.id">
                <td>{{ attributeValue.attribute.name }}</td>
                <td>{{ attributeValue.value }}</td>
              </tr>
            </table>

            <p class="playingcard__attribution">created by {{ game.pack.author.name }}</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const gameAttrs = `
  id
  pack {
    author {
      name
    }
  }
  piles {
    id
    name
    pileCards {
      id
      card {
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
  hands {
    player {
      id
      name
    }
    atTurn
    score
    piles {
      id
      name
      pileCards {
        id
        card {
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
  }
`

export default {
  apollo: {
    me: gql`
      query {
        me {
          id
        }
      }
    `,
    game: {
      query: gql`
        query($gameId: ID!) {
          game(where: { id: $gameId }) {
            ${gameAttrs}
          }
        }
      `,
      subscribeToMore: {
        document: gql`
          subscription games($id: ID!) {
            updatedGame(id: $id) {
              ${gameAttrs}
            }
          }
        `,
        variables() {
          return {
            id: this.gameId
          }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            game: subscriptionData.data.updatedGame
          }
        }
      },
      variables() {
        return {
          gameId: this.gameId
        }
      }
    }
  },
  asyncData({ params }) {
    return {
      gameId: params.game
    }
  },
  data() {
    return {
      imagesRoot: process.env.imagesRoot
    }
  },
  computed: {
    // TODO add a 'hidden' attribute to piles
    pricePile() {
      return this.game.piles.find(p => p.name == 'price')
    },
    // TODO write a query for this so that the other hand is kept secret
    myHand() {
      return this.game.hands.find(h => h.player.id == this.me.id)
    }
  },
  methods: {
    async joinGame() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($gameId: ID!) {
            joinGoofenspiel(gameId: $gameId)
          }
        `,
        variables: {
          gameId: this.gameId
        }
      })

      await this.$apollo.queries.game.refetch()
    },
    async bidCard(pileCard) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($gameId: ID!, $pileCardId: ID!) {
            bidGoofenspiel(gameId: $gameId, pileCardId: $pileCardId)
          }
        `,
        variables: {
          gameId: this.gameId,
          pileCardId: pileCard.id
        }
      })

      await this.$apollo.queries.game.refetch()
    }
  }
}
</script>
