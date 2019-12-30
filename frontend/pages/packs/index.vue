<template>
  <div class="container container--page">
    <div v-if="me != undefined" class="mb-16">
      <h1 class="page-heading">Your Card Packs</h1>

      <div class="flex justify-center my-4">
        <nuxt-link
          to="/packs/new"
          class="button button--lg button--round button--secondary shadow-md font-semibold"
        >Create New</nuxt-link>
      </div>

      <div class="flex flex-wrap justify-center">
        <nuxt-link
          v-for="pack in me.trumpPacks"
          :key="pack.id"
          :to="`/packs/${pack.id}`"
          class="playingcard playingcard--interactive mr-8"
        >
          <div class="playingcard__container playingcard__container--lg">
            <div class="playingcard__container playingcard__container--lg">
              <div class="playingcard__container playingcard__container--lg leading-loose relative">
                <button class="playingcard__title text-primary-500">{{ pack.name }}</button>
                <p>Description: {{ pack.description }}</p>
                <div class="playingcard__attributes">
                  <p class="text-left mt-2 pt-1 mb-1 border-t">Attributes:</p>
                  <ul class="ml-6">
                    <li
                      v-for="attribute in pack.attributes"
                      :key="attribute.id"
                    >{{ attribute.name }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>

    <div>
      <h2 class="page-subheading">Explore Card Packs by the Community</h2>
    </div>

    <div class="flex flex-wrap justify-center">
      <nuxt-link
        v-for="pack in featuredTrumpPacks"
        :key="pack.id"
        :to="`/packs/${pack.id}`"
        class="playingcard playingcard--interactive mr-8"
      >
        <div class="playingcard__container playingcard__container--sm">
          <div class="playingcard__container playingcard__container--sm">
            <div class="playingcard__container playingcard__container--sm leading-loose relative">
              <button class="playingcard__title text-primary-500">{{ pack.name }}</button>
              <p>Author: {{ pack.author.name }}</p>
              <p>Description: {{ pack.description }}</p>
              <div class="playingcard__attributes">
                <p class="text-left mt-2 pt-1 mb-1 border-t">Attributes:</p>
                <ul class="ml-6">
                  <li v-for="attribute in pack.attributes" :key="attribute.id">{{ attribute.name }}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'

const trumpPackAttributes = `
  id
  name
  author {
    name
  }
  attributes {
    id
    name
  }
`

export default {
  apollo: {
    me: gql`
      query {
        me {
          id
          trumpPacks {
            ${trumpPackAttributes}
          }
        }
      }
    `,
    featuredTrumpPacks: gql`
      query {
        featuredTrumpPacks(last: 3) {
          ${trumpPackAttributes}
        }
      }
    `
  }
}
</script>
