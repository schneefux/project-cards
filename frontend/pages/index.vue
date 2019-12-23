<template>
  <div>
    <div v-for="pack in (me || {}).trumpPacks" :key="pack.id">
      <p>Pack: {{ pack.name }}</p>

      <div
        v-for="card in pack.cards"
        :key="card.id"
        class="playingcard playingcard--md playingcard--interactive"
      >
        <div class="playingcard__container">
          <p class="playingcard__title">{{ card.name }}</p>
          <div class="playingcard__image boxedimage">
            <div class="boxedimage__container">
              <img class="boxedimage__image" :src="imagesRoot + card.imageUrl" />
            </div>
          </div>
          <table class="playingcard__attributes">
            <tr v-for="attributeValue in card.attributeValues" :key="attributeValue.id">
              <td>{{ attributeValue.attribute.name }}</td>
              <td>{{ attributeValue.value }}</td>
            </tr>
          </table>

          <p class="playingcard__attribution">created by {{ pack.author.name }}</p>
        </div>
      </div>
    </div>

    <h1 v-show="me == null" class="my-4 text-red-600">Login first!!!</h1>

    <h1 class="mt-8">Create a Pack</h1>

    <button @click="createPack" class="border block">Create Pack</button>

    <input type="text" v-model="packName" class="textinput block" />

    <div class="playingcard playingcard--lg">
      <div class="playingcard__container">
        <span class="playingcard__title">Placeholder Title</span>
        <div class="playingcard__image boxedimage relative">
          <div class="boxedimage__container">
            <img class="boxedimage__image" src="/snowman.png" />
            <span class="absolute inset-0">placeholder image</span>
          </div>
        </div>
        <div class="playingcard__attributes">
          <div class="flex">
            <input type="text" v-model="attribute" maxlength="16" class="w-3/4 mr-px textinput" />
            <input type="text" v-model="unit" maxlength="8" class="w-1/4 textinput" />
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

    <h1 v-show="pack == undefined" class="my-4 text-red-600">Must create pack first!!!</h1>

    <h1 class="mt-8">Create new Card</h1>
    <button @click="saveCard" class="border block">Create Card</button>

    <div class="playingcard playingcard--lg">
      <div class="playingcard__container">
        <input type="text" v-model="cardName" maxlength="20" class="playingcard__title textinput" />
        <div class="playingcard__image boxedimage relative">
          <div class="boxedimage__container">
            <img class="boxedimage__image" :src="image" />
          </div>
          <label
            class="absolute bottom-0 right-0 rounded-tl pl-1 pr-px bg-blue-500 hover:bg-blue-400 text-white"
          >
            select
            <input type="file" accept="image/*" class="hidden" @change="selectImage" />
          </label>
        </div>
        <div class="playingcard__attributes">
          <div class="flex">
            <span class="w-1/2">{{ attribute }}</span>
            <input type="number" v-model="value" class="w-1/4 mr-px textinput" />
            <span class="w-1/4">{{ unit }}</span>
          </div>
        </div>
        <p class="playingcard__attribution">created by {{ author }}</p>
      </div>
    </div>
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
            cards {
              id
              name
              imageUrl
              attributeValues {
                id
                value
                attribute {
                  id
                  name
                  aimHigh
                }
              }
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
  },
  data() {
    return {
      pack: undefined,
      packName: 'Pack Title',
      cardName: 'Card Title',
      author: 'Author',
      image: '',
      imageFile: undefined,
      attribute: 'Attribute',
      attributeId: undefined,
      value: 1,
      unit: 'u',
      imagesRoot: process.env.imagesRoot
    }
  },
  methods: {
    async createPack() {
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
          author: this.me.id,
          name: this.packName,
          description: '',
          attributeName: this.attribute
          // TODO add unit
        }
      })

      this.pack = response.data.createOneTrumpPack.id
      this.attributeId = response.data.createOneTrumpPack.attributes[0].id
      await this.$apollo.queries.me.refetch()
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
          name: this.cardName,
          pack: this.pack,
          description: '',
          attribute0: this.attributeId,
          value0: parseFloat(this.value)
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

      await this.$apollo.queries.me.refetch()
    }
  }
}
</script>
