<template>
  <v-layout row>
    <v-flex xs12>
      Packs: {{ trumpPacks }}
    </v-flex>
    <v-flex xs12>
      Games: {{ trumpGames }}
    </v-flex>
    <v-flex xs12>
      <v-btn @click="addUser">
        Neuen Benutzer anlegen
      </v-btn>
      <v-btn @click="addPack">
        Neues Pack anlegen
      </v-btn>
      <v-btn @click="startTrumpGame">
        Neues Spiel starten
      </v-btn>
    </v-flex>
    <button class="shadow bg-blue-500 px-4 py-2 text-white hover:bg-blue-400">
      tailwind button test
    </button>
  </v-layout>
</template>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    trumpPacks: {
      query: gql`query {
        trumpPacks {
          name
        }
      }`,
    },
    trumpGames: {
      query: gql`query {
        trumpGames {
          id
        }
      }`,
      subscribeToMore: {
        document: gql`subscription trumpGames {
          createdTrumpGame {
            id
          }
        }`,
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            trumpGames: [
              ...previousResult.trumpGames,
              subscriptionData.data.createdTrumpGame,
            ],
          }
        }
      }
    }
  },
  data() {
    return {
      user: undefined,
      player: undefined,
      pack: undefined,
    }
  },
  methods: {
    async addUser() {
      const response = await this.$apollo.mutate({
        mutation: gql`mutation ($name: String!, $email: String!) {
          createOneUser (data: {
            name: $name,
            email: $email,
            trumpPlayer: {
              create: {}
            }
          }) {
            id
            trumpPlayer {
              id
            }
          }
        }`,
        variables: {
          name: 'random name ' + Math.random(),
          email: 'random@' + Math.random(),
        },
      })

      this.user = response.data.createOneUser.id
      this.player = response.data.createOneUser.trumpPlayer.id
    },
    async addPack() {
      const response = await this.$apollo.mutate({
        mutation: gql`mutation ($name: String!) {
          createOneTrumpPack (data: {
            name: $name,
          }) {
            id
          }
        }`,
        variables: {
          name: 'random pack ' + Math.random(),
        },
      })

      this.pack = response.data.createOneTrumpPack.id
    },
    async startTrumpGame() {
      await this.$apollo.mutate({
        mutation: gql`mutation ($player1: String!, $player2: String!, $pack: String!) {
          startTrumpGame (
            player1: $player1,
            player2: $player2,
            pack: $pack,
          ) {
            id
          }
        }`,
        variables: {
          player1: this.player,
          player2: this.player,
          pack: this.pack,
        },
      })
    }
  },
}
</script>
