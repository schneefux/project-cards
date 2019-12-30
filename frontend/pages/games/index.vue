<template>
  <div class="container container--page">
    <h1 class="page-heading">Games waiting for Players</h1>
    <ul class="mt-6">
      <li v-for="game in games" :key="game.id" class="my-2">
        <nuxt-link :to="`/games/${game.id}`" class="button">
          {{
          game.pack.name
          }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    games: {
      query: gql`
        query {
          games(where: { state: 'OPEN' }) {
            id
            pack {
              name
            }
          }
        }
      `,
      subscribeToMore: {
        document: gql`
          subscription games {
            createdGame {
              id
              pack {
                author {
                  name
                }
              }
            }
          }
        `,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            games: [...previousResult.games, subscriptionData.data.createdGame]
          }
        }
      }
    }
  }
}
</script>
