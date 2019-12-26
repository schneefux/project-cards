<template>
  <div class="container container--page">
    <p>Index page content goes here</p>
    <p>Live Game IDs: {{ games }}</p>
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
