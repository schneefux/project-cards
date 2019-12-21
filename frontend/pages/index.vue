<template>
  <div>
    <button class="shadow bg-blue-500 px-4 py-2 text-white hover:bg-blue-400">
      tailwind button test
    </button>

    <div class="playingcard playingcard--md">
      <p class="playingcard__title">
        Snowman
      </p>
      <div class="playingcard__image boxedimage">
        <div class="boxedimage__container">
          <img class="boxedimage__image" src="/snowman.png">
        </div>
      </div>
      <table class="playingcard__attribute-table">
        <tr>
          <td>Heat Resistance</td>
          <td>5&#176; C</td>
        </tr>
        <tr>
          <td>Weight</td>
          <td>5kg</td>
        </tr>
        <tr>
          <td>Lifetime</td>
          <td>14d</td>
        </tr>
      </table>
      <p class="playingcard__attribution">
        created by schneefux
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.playingcard {
  @apply border border-black rounded-lg px-3 py-1 m-2 font-sans relative bg-white;
  @apply shadow-lg mt-4;
}

.playingcard:hover {
  @apply shadow-xl mt-2;
}

.playingcard--sm {
  width: 6rem;
  height: 9rem;
  font-size: 0.45rem;
}

.playingcard--md {
  width: 8rem;
  height: 12rem;
  font-size: 0.6rem;
}

.playingcard--lg {
  width: 12rem;
  height: 18rem;
  font-size: 0.9rem;
}

.playingcard__title {
  @apply font-semibold text-center;
  @apply mb-2;
  font-size: 130%;
}

.playingcard__image {
  @apply w-5/6;
  @apply mb-2;
}

.playingcard__attribute-table {
  @apply w-full leading-snug;
}

.playingcard__attribution {
  @apply text-right text-gray-400 absolute bottom-0 right-0 mr-1;
  font-size: 70%;
}

/* responsive image with a border and fixed 1:1 ratio */
.boxedimage {
  @apply mx-auto p-1 border;
}

.boxedimage__container {
  @apply relative w-full;
  padding-top: 100%; /* 1:1 aspect ratio */
}

.boxedimage__image {
  @apply absolute inset-0;
  @apply w-auto h-auto max-w-full max-h-full m-auto;
}
</style>

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    trumpPacks: {
      query: gql`
        query {
          trumpPacks {
            name
          }
        }
      `
    },
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
  },
  data() {
    return {
      user: undefined,
      player: undefined,
      pack: undefined
    }
  },
  methods: {
    async addUser() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!, $email: String!) {
            createOneUser(
              data: { name: $name, email: $email, trumpPlayer: { create: {} } }
            ) {
              id
              trumpPlayer {
                id
              }
            }
          }
        `,
        variables: {
          name: 'random name ' + Math.random(),
          email: 'random@' + Math.random()
        }
      })

      this.user = response.data.createOneUser.id
      this.player = response.data.createOneUser.trumpPlayer.id
    },
    async addPack() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($name: String!) {
            createOneTrumpPack(data: { name: $name }) {
              id
            }
          }
        `,
        variables: {
          name: 'random pack ' + Math.random()
        }
      })

      this.pack = response.data.createOneTrumpPack.id
    },
    async startTrumpGame() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($player1: String!, $player2: String!, $pack: String!) {
            startTrumpGame(player1: $player1, player2: $player2, pack: $pack) {
              id
            }
          }
        `,
        variables: {
          player1: this.player,
          player2: this.player,
          pack: this.pack
        }
      })
    }
  }
}
</script>
