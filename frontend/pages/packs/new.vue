<template>
  <div class="container container--page">
    <h1 class="page-heading">Create a Pack</h1>

    <div class="flex flex-wrap">
      <div class="w-full">
        <label for="name" class="mr-1">Titel</label>
        <input type="text" v-model="packName" class="textinput" />
      </div>

      <div class="w-full mt-2 flex justify-center">
        <div class="playingcard playingcard--lg">
          <div class="playingcard__container">
            <p class="playingcard__title">Card Title</p>
            <div class="playingcard__image boxedimage relative">
              <div class="boxedimage__container">
                <img class="boxedimage__image" src="/snowman.png" />
                <span class="absolute inset-0">card image</span>
              </div>
            </div>
            <div class="playingcard__attributes">
              <div v-for="(attribute, index) in attributes" :key="index" class="flex">
                <input
                  type="text"
                  v-model="attribute.name"
                  maxlength="16"
                  class="w-3/4 mr-px textinput"
                />
                <input type="text" maxlength="8" class="w-1/4 textinput" />
              </div>
              <button @click="addAttribute" class="button button--sm mt-1">Add</button>
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
      </div>

      <div class="w-full mt-2 flex justify-end">
        <button @click="createPack" class="button button--secondary">Save</button>
      </div>
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
        }
      }
    `
  },
  data() {
    return {
      packName: 'Pack Title',
      author: 'Author',
      attributes: [
        {
          name: 'Attribute',
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
          description: '',
          attributes: this.attributes
          // TODO add unit
        }
      })

      const trumpPackId = response.data.createOneTrumpPack.id
      this.$router.push(`/packs/${trumpPackId}`)
    }
  }
}
</script>
