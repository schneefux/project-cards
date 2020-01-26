<template>
  <div class="container container--page">
    <h1 class="page-heading">Offene Spiele</h1>
    <p v-if="games.length == 0">Gerade laufen keine Spiele.</p>
    <div v-if="games.length == 0 && me != undefined && me.state == 'GUEST'">
      <p>Registriere dich und starte eins!</p>
      <nuxt-link to="/register" class="button button--sm">Registrieren</nuxt-link>
    </div>
    <ul class="mt-6">
      <li v-for="game in games" :key="game.id" class="mx-2 my-2 inline-block">
        <nuxt-link :to="`/games/${game.id}`" class="button button--white">
          <p class="font-semibold text-lg">{{ game.pack.name }}</p>
          <p>{{ game.pack.description }}</p>
        </nuxt-link>
      </li>
    </ul>
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
          state
        }
      }
    `,
    games: {
      query: gql`
        query {
          games(where: { state: OPEN }) {
            id
            pack {
              name
              description
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
                name
                description
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
