<template>
  <div>
    <nuxt-link v-show="me != null" to="/packs/new">go to new pack</nuxt-link>

    <p v-for="pack in (me || {}).trumpPacks" :key="pack.id">
      <nuxt-link :to="`/packs/${pack.id}`">go to pack "{{ pack.name }}"</nuxt-link>
    </p>

    <nuxt-link v-show="me == null" to="/login">go to login</nuxt-link>
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
          name
          trumpPacks {
            id
            name
            author {
              name
            }
          }
        }
      }
    `,
    trumpGames: {
      query: gql`
        query {
          trumpGames {
            id
          }
        }
      `,
      subscribeToMore: {
        document: gql`
          subscription trumpGames {
            createdTrumpGame {
              id
            }
          }
        `,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            trumpGames: [
              ...previousResult.trumpGames,
              subscriptionData.data.createdTrumpGame
            ]
          }
        }
      }
    }
  }
}
</script>
