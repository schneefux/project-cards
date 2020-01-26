<template>
  <div v-if="trumpPack != undefined" class="container container--page">
    <h1 class="page-heading">
      Neue Karte für
      <span class="text-gray-700">{{ trumpPack.name }}</span>
    </h1>

    <form ref="card-form" @submit.prevent="saveAndReturn" class="mt-2 flex flex-wrap">
      <div class="w-full mt-2 flex justify-center">
        <div class="playingcard">
          <div class="playingcard__container playingcard__container--lg">
            <div class="flex justify-between">
              <div class="w-8/12">
                <input
                  type="text"
                  v-model="cardName"
                  maxlength="20"
                  required
                  class="playingcard__title textinput"
                />
              </div>
              <div class="w-3/12">
                <input
                  type="number"
                  v-model.number="cardPoints"
                  required
                  class="playingcard__title textinput"
                />
              </div>
            </div>
            <div class="playingcard__image boxedimage relative">
              <div class="boxedimage__container">
                <img class="boxedimage__image" :src="image" />
              </div>
              <label
                class="absolute bottom-0 right-0 rounded-tl pl-1 pr-px bg-blue-500 hover:bg-blue-400 text-white"
              >
                auswählen
                <input
                  @change="selectImage"
                  type="file"
                  accept="image/*"
                  required
                  class="h-px w-px absolute bottom-0 right-0"
                />
              </label>
            </div>
            <div class="playingcard__attributes">
              <textarea type="text" v-model="cardDescription" required class="textinput w-full" />
            </div>
            <p class="playingcard__attribution">erstellt von {{ trumpPack.author.name }}</p>
          </div>
        </div>
      </div>

      <div class="w-full mt-4">
        <div class="ml-auto w-2/3 flex flex-wrap justify-end">
          <nuxt-link :to="`/packs/${trumpPack.id}`" class="button ml-1 mb-1">Abbrechen</nuxt-link>
          <button
            type="button"
            @click="saveAndReset"
            class="button button--secondary ml-1 mb-1"
          >Speichern und Nächste</button>
          <button
            type="submit"
            class="button button--secondary ml-1 mb-1"
          >Speichern und zur Übersicht</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

function initialFormData() {
  return {
    cardName: 'Card Title',
    cardDescription: 'Card Description',
    cardPoints: 0,
    image: '',
    imageFile: undefined
  }
}

export default {
  apollo: {
    trumpPack: {
      query: gql`
        query($trumpPackId: ID!) {
          trumpPack(where: { id: $trumpPackId }) {
            id
            name
            author {
              id
              name
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
      ...initialFormData()
    }
  },
  methods: {
    async selectImage(event) {
      const reader = new FileReader()
      reader.onload = () => (this.image = reader.result)
      this.imageFile = event.target.files[0]
      reader.readAsDataURL(this.imageFile)
    },
    async saveAndReturn() {
      await this.save()
      this.$router.push(`/packs/${this.trumpPack.id}`)
    },
    async saveAndReset() {
      // custom submit, no native browser validation
      if (!this.$refs['card-form'].reportValidity()) {
        return
      }

      await this.save()
      Object.assign(this.$data, initialFormData())
    },
    async save() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $name: String!
            $pack: ID!
            $description: String!
            $points: Int!
          ) {
            createOneTrumpCard(
              data: {
                name: $name
                pack: { connect: { id: $pack } }
                description: $description
                points: $points
              }
            ) {
              id
            }
          }
        `,
        variables: {
          name: this.cardName,
          pack: this.trumpPack.id,
          description: this.cardDescription,
          points: this.cardPoints
        },
        update: (store, { data: { createOneTrumpCard } }) => {
          const query = gql`
            query($id: ID!) {
              trumpPack(where: { id: $id }) {
                id
                cards {
                  id
                }
              }
            }
          `
          const variables = { id: this.trumpPack.id }

          const data = store.readQuery({ query, variables })
          data.trumpPack.cards.push(createOneTrumpCard)
          store.writeQuery({ query, variables, data })
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
