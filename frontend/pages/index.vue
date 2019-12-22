<template>
  <div>
    <button
      @click="addUser"
      class="shadow rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-400"
    >
      1 create user
    </button>

    <div class="playingcard playingcard--md playingcard--interactive">
      <div class="playingcard__container">
        <p class="playingcard__title">
          Snowman
        </p>
        <div class="playingcard__image boxedimage">
          <div class="boxedimage__container">
            <img class="boxedimage__image" src="/snowman.png" />
          </div>
        </div>
        <table class="playingcard__attributes">
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

    <div class="playingcard playingcard--lg">
      <div class="playingcard__container">
        <input
          type="text"
          v-model="title"
          maxlength="20"
          class="playingcard__title textinput"
        />
        <div class="playingcard__image boxedimage relative">
          <div class="boxedimage__container">
            <img class="boxedimage__image" :src="image" />
          </div>
          <label
            class="absolute bottom-0 right-0 rounded-tl pl-1 pr-px bg-blue-500 hover:bg-blue-400 text-white"
          >
            select
            <input
              type="file"
              accept="image/*"
              class="hidden"
              @change="selectImage"
            />
          </label>
        </div>
        <div class="playingcard__attributes">
          <div class="flex">
            <input
              type="text"
              v-model="attribute"
              maxlength="16"
              class="w-7/12 mr-px textinput"
            />
            <input
              type="number"
              v-model="value"
              class="w-3/12 mr-px textinput"
            />
            <input
              type="text"
              v-model="unit"
              maxlength="8"
              class="w-2/12 textinput"
            />
          </div>
        </div>
        <p class="playingcard__attribution">
          created by
          <input
            type="text"
            v-model="author"
            maxlength="16"
            class="textinput"
            :style="`width: ${author.length}ch;`"
          />
        </p>
      </div>
    </div>

    <button
      @click="addPack"
      class="shadow rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-400"
    >
      2 create pack
    </button>

    <button
      @click="saveCard"
      class="shadow rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-400"
    >
      3 save card
    </button>
  </div>
</template>

<style scoped lang="scss">
.playingcard {
  @apply m-2 inline-block;
}

.playingcard--sm {
  .playingcard__container {
    width: 6rem;
    height: 9rem;
    font-size: 0.45rem;
  }
}

.playingcard--md {
  .playingcard__container {
    width: 8rem;
    height: 12rem;
    font-size: 0.6rem;
  }
}

.playingcard--lg {
  .playingcard__container {
    width: 12rem;
    height: 18rem;
    font-size: 0.9rem;
  }
}

.playingcard__container {
  @apply border border-black rounded-lg px-3 py-1 font-sans relative bg-white;
}

.playingcard--interactive {
  @apply pt-4;

  .playingcard__container {
    @apply shadow-lg;
  }

  &:hover {
    @apply pt-2 pb-2;

    .playingcard__container {
      @apply shadow-xl;
    }
  }
}

.playingcard__title {
  @apply w-full font-semibold text-center;
  @apply mb-2;
  font-size: 130%;
}

.playingcard__image {
  @apply w-5/6;
  @apply mb-2;
}

.playingcard__attributes {
  @apply w-full leading-snug;
}

.playingcard__attribution {
  @apply text-right text-gray-400 absolute bottom-0 right-0 mr-1 mb-px;
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

.textinput {
  @apply shadow border rounded-sm border-blue-300 appearance-none;

  &:focus {
    @apply outline-none shadow-outline;
  }
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
      pack: undefined,
      title: 'Titel',
      author: 'Autor',
      image: '',
      imageFile: undefined,
      attribute: 'Attribut',
      attributeId: undefined,
      value: 1,
      unit: 'u'
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
          mutation(
            $author: ID!
            $name: String!
            $description: String!
            $attributeName: String!
          ) {
            createOneTrumpPack(
              data: {
                name: $name
                author: { connect: { id: $author } }
                description: $description
                attributes: {
                  create: [{ name: $attributeName, aimHigh: true }]
                }
              }
            ) {
              id
              attributes {
                id
              }
            }
          }
        `,
        variables: {
          author: this.player,
          description: '',
          name: 'random pack ' + Math.random(),
          attributeName: this.attribute
        }
      })

      this.pack = response.data.createOneTrumpPack.id
      this.attributeId = response.data.createOneTrumpPack.attributes[0].id
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
    },
    async selectImage(event) {
      const reader = new FileReader()
      reader.onload = () => (this.image = reader.result)
      this.imageFile = event.target.files[0]
      reader.readAsDataURL(this.imageFile)
    },
    async saveCard() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $name: String!
            $pack: ID!
            $description: String!
            $attribute0: ID!
            $value0: Float!
          ) {
            createOneTrumpCard(
              data: {
                name: $name
                pack: { connect: { id: $pack } }
                description: $description
                attributeValues: {
                  create: [
                    {
                      value: $value0
                      attribute: { connect: { id: $attribute0 } }
                    }
                  ]
                }
              }
            ) {
              id
            }
          }
        `,
        variables: {
          name: this.title,
          pack: this.pack,
          description: '',
          attribute0: this.attributeId,
          value0: this.value
        }
      })

      const cardId = response.data.createOneTrumpCard.id

      await this.$apollo.mutate({
        mutation: gql`
          mutation($file: Upload!, $cardId: ID!) {
            uploadTrumpCardImage(file: $file, cardId: $cardId)
          }
        `,
        variables: {
          file: this.imageFile,
          cardId: cardId
        }
      })
    }
  }
}
</script>
