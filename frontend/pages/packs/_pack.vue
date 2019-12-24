<template>
  <div>
    <p>Pack: {{ trumpPack.name }}</p>

    <div
      v-for="card in trumpPack.cards"
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

        <p class="playingcard__attribution">created by {{ trumpPack.author.name }}</p>
      </div>
    </div>

    <h1 class="mt-8">Add new Card</h1>
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

<script>
import gql from 'graphql-tag'

export default {
  apollo: {
    trumpPack: {
      query: gql`
        query($trumpPackId: ID!) {
          trumpPack(where: { id: $trumpPackId }) {
            id
            name
            author {
              name
            }
            attributes {
              id
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
      `,
      variables() {
        return {
          trumpPackId: this.trumpPackId
        }
      }
    }
  },
  asyncData({ params }) {
    return {
      trumpPackId: params.pack
    }
  },
  data() {
    return {
      trumpPack: {},
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
          pack: this.trumpPack.id,
          description: '',
          attribute0: this.trumpPack.attributes[0].id,
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

      await this.$apollo.queries.trumpPack.refetch()
    }
  }
}
</script>
