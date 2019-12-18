<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <v-flex xs12>
      {{ trumpPacks }}
    </v-flex>
    <v-flex xs12>
      <v-btn @click="addTrumpPack">
        Neues hinzufügen
      </v-btn>
    </v-flex>
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
      }`
    }
  },
  methods: {
    async addTrumpPack() {
      await this.$apollo.mutate({
        mutation: gql`mutation ($name: String!) {
          createOneTrumpPack (data: {
            name: $name
          }) {
            id
          }
        }`,
        variables: {
          name: 'testing' + Math.random() * 100,
        },
      })
    }
  },
}
</script>
