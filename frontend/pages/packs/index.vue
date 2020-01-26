<template>
  <div class="container container--page">
    <div v-if="me != undefined && me.subscriptionTier != 'GUEST'" class="mb-16">
      <h1 class="page-heading">Deine Kartenspiele</h1>

      <div class="flex justify-center my-4">
        <nuxt-link
          to="/packs/new"
          class="button button--lg button--round button--secondary"
        >Neues Erstellen</nuxt-link>
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
                <p>Beschreibung: {{ pack.description }}</p>
              </div>
            </div>
          </div>
        </nuxt-link>
      </div>
    </div>

    <h2 class="page-subheading">Entdecke Kartenspiele von der Community</h2>

    <div class="flex flex-wrap justify-center mb-16">
      <nuxt-link
        v-for="pack in trumpPacks"
        :key="pack.id"
        :to="`/packs/${pack.id}`"
        class="playingcard playingcard--interactive mr-8"
      >
        <div class="playingcard__container playingcard__container--sm">
          <div class="playingcard__container playingcard__container--sm">
            <div class="playingcard__container playingcard__container--sm leading-loose relative">
              <button class="playingcard__title text-primary-500">{{ pack.name }}</button>
              <p>Autor: {{ pack.author.name }}</p>
              <p>Beschreibung: {{ pack.description }}</p>
            </div>
          </div>
        </div>
      </nuxt-link>
    </div>

    <div v-if="me == undefined || me.subscriptionTier == 'GUEST'" class="mb-16">
      <h2 class="page-subheading">Registriere dich und erstelle dein eigenes</h2>
      <p class="mb-2">Mit einem kostenlosen Account kannst du deine eigenen Kartenspiele erstellen.</p>
      <nuxt-link
        to="/packs/new"
        class="inline-block button button--lg button--secondary"
      >Registrieren</nuxt-link>
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
`

export default {
  apollo: {
    me: gql`
      query {
        me {
          id
          subscriptionTier
          trumpPacks {
            ${trumpPackAttributes}
          }
        }
      }
    `,
    trumpPacks: gql`
      query {
        trumpPacks(orderBy: {
          createdAt: desc
        }, last: 3) {
          ${trumpPackAttributes}
        }
      }
    `
  }
}
</script>
