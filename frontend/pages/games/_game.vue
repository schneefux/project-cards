<template>
  <div v-if="game != undefined" class="container container--page">
    <h1 class="page-heading">Game {{ game.id }}</h1>
    <div class="mb-2">
      Piles:
      <ul>
        <li v-for="pile in game.piles" :key="pile.id">
          {{ pile.name }}
          ({{ pile.cards.map(c => c.name) }})
        </li>
      </ul>
    </div>
    <div v-for="hand in game.hands" :key="hand.id" class="mb-2">
      {{ hand.player.name }} ({{ hand.score }} points - {{ hand.atTurn ? 'at turn' : 'not at turn' }}):
      <ul>
        <li v-for="pile in hand.piles" :key="pile.id">
          {{ pile.name }}
          ({{ pile.cards.map(c => c.name) }})
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    game: {
      query: gql`
        query($gameId: ID!) {
          game(where: { id: $gameId }) {
            id
            piles {
              name
              cards {
                name
              }
            }
            hands {
              player {
                name
              }
              atTurn
              score
              piles {
                name
                cards {
                  name
                }
              }
            }
          }
        }
      `,
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
  }
}
</script>
