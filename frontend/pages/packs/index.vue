<template>
  <div v-if="me != undefined" class="container container--page">
    <h1 class="page-heading">Your Packs</h1>

    <div class="flex justify-center my-2">
      <nuxt-link to="/packs/new" class="button button--secondary font-semibold">Create New</nuxt-link>
    </div>

    <div class="flex flex-wrap justify-center">
      <nuxt-link
        v-for="pack in me.trumpPacks"
        :key="pack.id"
        :to="`/packs/${pack.id}`"
        class="playingcard playingcard--lg playingcard--interactive"
      >
        <div class="playingcard__container leading-loose">
          <p class="playingcard__title text-primary-500 underline">{{ pack.name }}</p>
          <p>Author: {{ pack.author.name }}</p>
          <p>Description: {{ pack.description }}</p>
          <div class="playingcard__attributes">
            <p class="text-left mt-2 pt-1 mb-1 border-t">Attributes:</p>
            <ul class="ml-6">
              <li v-for="attribute in pack.attributes" :key="attribute.id">{{ attribute.name }}</li>
            </ul>
          </div>
        </div>
      </nuxt-link>
    </div>
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
            attributes {
              id
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
