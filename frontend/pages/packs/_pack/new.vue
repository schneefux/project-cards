<template>
  <div v-if="trumpPack != undefined" class="container container--page">
    <h1 class="page-heading">New Card for "{{ trumpPack.name }}"</h1>

    <form ref="card-form" @submit.prevent="saveAndReturn" class="mt-2 flex flex-wrap">
      <div class="w-full mt-2 flex justify-center">
        <div class="playingcard playingcard--lg">
          <div class="playingcard__container">
            <input
              type="text"
              v-model="cardName"
              maxlength="20"
              required
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
                  @change="selectImage"
                  type="file"
                  accept="image/*"
                  required
                  class="h-px w-px absolute bottom-0 right-0"
                />
              </label>
            </div>
            <div class="playingcard__attributes">
              <div v-for="attribute in trumpPack.attributes" :key="attribute.id" class="flex">
                <span class="w-1/2">{{ attribute.name }}</span>
                <input
                  type="number"
                  v-model="attribute.value"
                  required
                  class="w-1/4 mr-px textinput"
                />
                <span class="w-1/4">u</span>
              </div>
            </div>
            <p class="playingcard__attribution">created by {{ trumpPack.author.name }}</p>
          </div>
        </div>
      </div>

      <div class="w-full mt-2 flex flex-wrap justify-end">
        <button
          type="button"
          @click="saveAndReset"
          class="button button--secondary mb-1"
        >Save and Create Another</button>
        <button type="submit" class="button button--secondary ml-1 mb-1">Save and Return to Packs</button>
      </div>
    </form>
  </div>
</template>

<script>
import gql from 'graphql-tag'

function initialFormData() {
  return {
    cardName: 'Card Title',
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
              name
            }
            attributes {
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
      this.trumpPack.attributes.forEach(a => delete a.value)
      Object.assign(this.$data, initialFormData())
    },
    async save() {
      const attributeValuesInput = this.trumpPack.attributes.map(
        ({ id, value }) => ({
          value: parseFloat(value),
          attribute: { connect: { id } }
        })
      )

      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $name: String!
            $pack: ID!
            $description: String!
            $attributeValues: [TrumpAttributeValueCreateWithoutCardInput!]!
          ) {
            createOneTrumpCard(
              data: {
                name: $name
                pack: { connect: { id: $pack } }
                description: $description
                attributeValues: { create: $attributeValues }
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
          attributeValues: attributeValuesInput
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
