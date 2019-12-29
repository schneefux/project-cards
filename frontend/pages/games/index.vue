<template>
  <div class="container container--page">
    <h1 class="page-heading">Games waiting for Players</h1>
    <ul class="mt-6">
      <li v-for="game in openGames" :key="game.id" class="my-2">
        <nuxt-link :to="`/games/${game.id}`" class="button">{{
          game.pack.name
        }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    openGames: {
      query: gql`
        query {
          openGames {
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
