<template>
  <div class="container container--page">
    <p>Index page content goes here</p>
    <p>Live Games</p>
    <ul>
      <li v-for="game in games" :key="game.id" class="my-2">
        <nuxt-link :to="`/games/${game.id}`" class="button">{{ game.id }}</nuxt-link>
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
          games {
            id
          }
        }
      `,
      subscribeToMore: {
        document: gql`
          subscription games {
            createdGame {
              id
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
