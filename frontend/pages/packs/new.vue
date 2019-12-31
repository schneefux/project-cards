<template>
  <div class="container container--page">
    <h1 class="page-heading">Create a Card Pack</h1>

    <form @submit.prevent="createPack" class="mt-6">
      <div class="block w-64 mx-auto md:mx-0">
        <div class="block flex">
          <label for="name" class="mr-1 w-4/12">Title</label>
          <input type="text" v-model="packName" maxlength="20" required class="textinput w-8/12" />
        </div>

        <div class="block flex mt-2">
          <label for="name" class="mr-1 w-4/12">Description</label>
          <input
            type="text"
            v-model="packDescription"
            maxlength="20"
            required
            class="textinput w-8/12"
          />
        </div>
      </div>

      <div class="mt-6">
        <h2 class="page-subheading">Card Design</h2>
      </div>

      <div class="block mt-2 flex justify-center">
        <div class="playingcard">
          <div class="playingcard__container playingcard__container--lg">
            <p class="playingcard__title">Card Title</p>
            <div class="playingcard__image boxedimage relative">
              <div class="boxedimage__container">
                <div class="boxedimage__image"></div>
                <span class="absolute bottom-0 inset-x-0 text-center text-gray-400">card image</span>
              </div>
            </div>
            <div class="playingcard__attributes">
              <div v-for="(attribute, index) in attributes" :key="index" class="flex">
                <input
                  type="text"
                  v-model="attribute.name"
                  maxlength="16"
                  required
                  placeholder="Attribute Name"
                  class="w-8/12 mr-px textinput"
                />
                <span class="w-2/12">999</span>
                <input
                  type="text"
                  v-model="attribute.unit"
                  maxlength="8"
                  required
                  placeholder="unit"
                  class="w-2/12 textinput"
                />
              </div>
              <button
                @click="addAttribute"
                v-show="attributes.length < 5"
                type="button"
                class="button button--sm mt-1"
              >Add</button>
              <button
                @click="removeAttribute"
                v-show="attributes.length > 1"
                type="button"
                class="button button--sm mt-1"
              >Remove</button>
            </div>
            <p class="playingcard__attribution">created by {{ me.name }}</p>
          </div>
        </div>
      </div>

      <div class="block mt-2 flex justify-end">
        <button type="submit" class="button button--secondary button--lg">Save</button>
      </div>
    </form>
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
        }
      }
    `
  },
  data() {
    return {
      packName: '',
      packDescription: '',
      attributes: [
        {
          name: '',
          aimHigh: true
        }
      ]
    }
  },
  methods: {
    addAttribute() {
      this.attributes.push({
        name: '',
        aimHigh: true
      })
    },
    removeAttribute() {
      this.attributes.pop()
    },
    async createPack() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation(
            $author: ID!
            $name: String!
            $description: String!
            $attributes: [TrumpAttributeCreateWithoutPackInput!]!
          ) {
            createOneTrumpPack(
              data: {
                name: $name
                author: { connect: { id: $author } }
                description: $description
                attributes: { create: $attributes }
              }
            ) {
              id
            }
          }
        `,
        variables: {
          author: this.me.id,
          name: this.packName,
          description: this.packDescription,
          attributes: this.attributes
        },
        update: (store, { data: { createOneTrumpPack } }) => {
          const query = gql`
            query {
              me {
                id
                trumpPacks {
                  id
                }
              }
            }
          `

          const data = store.readQuery({ query })
          data.me.trumpPacks.push(createOneTrumpPack)
          store.writeQuery({ query, data })
        }
      })

      const trumpPackId = response.data.createOneTrumpPack.id
      this.$router.push(`/packs/${trumpPackId}`)
    }
  },
  middleware: ['free']
}
</script>
