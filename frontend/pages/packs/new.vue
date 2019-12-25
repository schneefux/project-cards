<template>
  <div>
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
  </div>
</template>

<script>
import gql from 'graphql-tag'

export default {
  data() {
    return {
      packName: 'Pack Title',
      author: 'Author',
      attribute: 'Attribute',
      unit: 'u'
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

      await this.$apollo.queries.me.refetch()
    }
  }
}
</script>
