<template>
  <div v-if="game != undefined" class="container container--page">
    <h1 class="page-heading">
      Spiel
      <span class="text-gray-600">{{ game.hands[0].player.name }}</span>
      gegen
      <span
        v-if="game.hands.length > 1"
        class="text-gray-600"
      >{{ game.hands[1].player.name }}</span>
      <span v-else class="text-gray-600 italic">warte auf Gegner</span>
    </h1>

    <button
      @click="joinGame"
      v-if="canJoin"
      class="button button--lg button--secondary my-3"
    >Beitreten</button>

    <p v-if="!canJoin && game.state == 'OPEN'">
      Lade einen Freund mit diesem Link ein:
      <a :href="selfLink" class="underline">{{ selfLink }}</a>
    </p>

    <div v-if="game.state == 'FINISHED'">
      <p>Das Spiel ist zu Ende.</p>
      <ul class="ml-4 mt-2">
        <li>{{ game.hands[0].player.name }}: {{ game.hands[0].score }} Punkte</li>
        <li>{{ game.hands[1].player.name }}: {{ game.hands[1].score }} Punkte</li>
      </ul>

      <button
        v-if="me != undefined && me.subscriptionTier != 'GUEST'"
        @click="createGoofenspiel"
        class="button button--secondary button--lg shadow-md float-left my-2 ml-4 mr-6"
      >Noch ein Spiel starten</button>
    </div>

    <div v-if="game.state == 'RUNNING'">
      <div
        v-for="(side, sideIndex) in sides"
        :key="side.id"
        :class="{
          'transform-flip-y': sideIndex == 0,
          'opacity-75': !side.atTurn,
        }"
        class="w-full"
      >
        <div
          class="relative w-full h-40 rounded-b-lg z-0"
          :class="{
            'bg-secondary-500': sideIndex == 0,
            'bg-primary-500': sideIndex == 1,
          }"
        >
          <template v-if="sideIndex == 1">
            <div class="flex justify-center z-10">
              <div
                v-for="pileCard in pricePile.pileCards"
                :key="pileCard.id"
                :style="`
                  margin-top: -${(CENTER_CARD_W * CARD_RATIO) / 2}rem;
                  margin-left: ${CENTER_CARD_W / 4}rem;
                  margin-right: ${CENTER_CARD_W / 4}rem;
                  width: ${CENTER_CARD_W}rem;
                  height: ${CENTER_CARD_W * CARD_RATIO}rem;
                `"
                class="playingcard__container"
              >{{ pileCard.card.name }} ({{ pileCard.card.points }})</div>
            </div>
            <draggable
              v-show="!spread"
              :list="hands[sideIndex].pileCards"
              :group="`cards-${sideIndex}`"
              class="border-gray-700 border-dashed border-4 px-2 py-1 mx-auto flex justify-center items-center relative z-20"
              :style="`
                margin-top: -${CENTER_CARD_W * CARD_RATIO * 0.75}rem;
                width: ${HAND_SPACE_W}rem;
                height: ${CENTER_CARD_W * CARD_RATIO * 1.5}rem;
                background: rgba(0, 0, 0, 0.25);
              `"
              @add="event => addBid(sideIndex, event)"
            >
              <p
                class="absolute top-0 left-0 text-gray-200 font-semibold"
              >Ziehe die Karte hierher als Einsatz.</p>
            </draggable>
            <div
              :style="`
                margin-top: -${(CENTER_CARD_W * CARD_RATIO) * 0.5}rem;
                margin-right: -${CENTER_CARD_W * 3/4}rem;
              `"
              class="absolute top-0 left-0 ml-1"
            >
              <div
                :style="`
                  width: ${CENTER_CARD_W}rem;
                  height: ${CENTER_CARD_W * CARD_RATIO}rem;
                `"
                class="playingcard__container"
              >{{ pricePile.pileCards.length }} Karten übrig</div>
            </div>
            <div
              v-for="betSide in 2"
              :key="betSide"
              :style="`
                margin-top: -${(CENTER_CARD_W * CARD_RATIO) * 0.75}rem;
                margin-left: -${CENTER_CARD_W * 3/4}rem;
              `"
              :class="{ 'hidden md:block': betSide == 1 }"
              class="absolute top-0 right-0 mr-1"
            >
              <p
                class="text-center text-sm flex md:block flex-col justify-end"
                :style="`
                  width: ${CENTER_CARD_W}rem;
                  height: ${CENTER_CARD_W * CARD_RATIO * 0.5}rem;
                `"
              >{{ betSide == 2 ? 'Dein Einsatz' : 'Einsatz des Gegners' }}</p>
              <div
                v-for="pileCard in bids[betSide - 1].pileCards"
                :key="pileCard.id"
                :style="`
                  margin-bottom: -${(CENTER_CARD_W * CARD_RATIO) * 0.75}rem;
                  ${betSide == 1 ? `margin-right: ${CENTER_CARD_W * 1.25}rem;` : ''}
                  width: ${CENTER_CARD_W}rem;
                  height: ${CENTER_CARD_W * CARD_RATIO}rem;
                `"
                class="playingcard__container"
              >{{ pileCard.card.name }} ({{ pileCard.card.points }})</div>
            </div>
          </template>
        </div>
        <div
          class="border border-gray-700 relative mx-auto rounded-full flex justify-center"
          :class="{
            'bg-secondary-500': sideIndex == 0,
            'bg-primary-500': sideIndex == 1,
          }"
          :style="`
            width: ${HAND_SPACE_W}rem;
            height: ${HAND_SPACE_H}rem;
          `"
        >
          <draggable
            :list="hands[sideIndex].pileCards"
            :group="`cards-${sideIndex}`"
            :style="`
              margin-top: -5rem;
              display: grid;
              grid-template-columns: repeat(${hands[sideIndex].pileCards * HAND_CARD_OVERLAP}, 1fr);
              transition: all 0.3s;
              ${spread || sideIndex == 0 ? `padding-right: ${HAND_CARD_W / 2}rem;` : ''}
              ${spread || sideIndex == 0 ? '' : `margin-right: calc(-50vw + 50%);`}
              ${spread || sideIndex == 0 ? '' : `margin-left: calc(-50vw + 50%);`}
            `"
            class="h-full"
            @start="spread = false"
            @end="spread = true"
          >
            <div
              v-for="(pileCard, index) in hands[sideIndex].pileCards"
              :key="pileCard.id"
              :style="`
                grid-column: auto / span ${HAND_CARD_OVERLAP};
                grid-row: 1;
                width: ${HAND_CARD_W}rem;
                height: ${HAND_CARD_W * CARD_RATIO}rem;
                transition: all 0.3s;
                ${spread || sideIndex == 0 ? `transform: rotate(${-30 + ((index + 0.5) / hands[sideIndex].pileCards.length) * 60}deg);` : ''}
                ${spread || sideIndex == 0 ? `margin-top: ${Math.abs(index + 0.5 - hands[sideIndex].pileCards.length / 2) / 2}rem;` : ''}
                ${spread || sideIndex == 0 ? '' : 'transform: scale(1.2);'}
                ${spread || sideIndex == 0 ? '' : 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
              `"
              class="playingcard__container"
            >{{ pileCard.card.name }} ({{ pileCard.card.points }})</div>
          </draggable>
          <p
            class="text-center w-full absolute font-semibold"
            :class="{ 'transform-flip-y': sideIndex == 0 }"
            style="top: 50%"
          >{{ side.score }} Punkte</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import draggable from 'vuedraggable'

const gameAttrs = `
  id
  state
  pack {
    id
    author {
      name
    }
  }
  piles {
    id
    name
    pileCards {
      id
      card {
        id
        name
        imageUrl
        points
      }
    }
  }
  hands {
    id
    player {
      id
      name
    }
    atTurn
    score
    piles {
      id
      name
      pileCards {
        id
        card {
          id
          name
          imageUrl
          points
        }
      }
    }
  }
`

export default {
  apollo: {
    me: gql`
      query {
        me {
          id
          subscriptionTier
        }
      }
    `,
    game: {
      query: gql`
        query($gameId: ID!) {
          game(where: { id: $gameId }) {
            ${gameAttrs}
          }
        }
      `,
      subscribeToMore: {
        document: gql`
          subscription games($id: ID!) {
            updatedGame(id: $id) {
              ${gameAttrs}
            }
          }
        `,
        variables() {
          return {
            id: this.gameId
          }
        },
        updateQuery: (previousResult, { subscriptionData }) => {
          return {
            game: subscriptionData.data.updatedGame
          }
        }
      },
      variables() {
        return {
          gameId: this.gameId
        }
      }
    }
  },
  asyncData({ params }) {
    return {
      gameId: params.game
    }
  },
  data() {
    return {
      imagesRoot: process.env.imagesRoot,
      CARD_RATIO: 9 / 6,
      CENTER_CARD_W: 4,
      HAND_CARD_W: 4,
      HAND_SPACE_W: 20,
      HAND_SPACE_H: 8,
      HAND_CARD_OVERLAP: 4,
      spread: true
    }
  },
  computed: {
    canJoin() {
      return (
        this.game.state == 'OPEN' &&
        this.game.hands.find(h => h.player.id == this.me.id) == undefined
      )
    },
    // TODO add a 'hidden' attribute to piles
    pricePile: {
      get() {
        return this.game.piles.find(p => p.name == 'price')
      },
      set(value) {}
    },
    // TODO write queries so that the other hand is kept secret
    hands: {
      get() {
        return this.sides.map(h => h.piles.find(p => p.name == 'hand'))
      },
      set(value) {}
    },
    bids: {
      get() {
        return this.sides.map(h => h.piles.find(p => p.name == 'bid'))
      },
      set(value) {}
    },
    sides() {
      const myHand = this.game.hands.find(h => h.player.id == this.me.id)
      const opponentHand = this.game.hands.find(h => h.player.id != this.me.id)
      return [opponentHand, myHand]
    },
    selfLink() {
      if (process.client) {
        return window.location.href
      }
      return ''
    }
  },
  components: {
    draggable
  },
  methods: {
    async joinGame() {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($gameId: ID!) {
            joinGoofenspiel(gameId: $gameId)
          }
        `,
        variables: {
          gameId: this.gameId
        }
      })

      await this.$apollo.queries.game.refetch()
    },
    async addBid(index, event) {
      // index 1: player hand
      const pileCard = this.hands[1].pileCards[event.oldIndex]
      await this.bidCard(pileCard)
    },
    async bidCard(pileCard) {
      await this.$apollo.mutate({
        mutation: gql`
          mutation($gameId: ID!, $pileCardId: ID!) {
            bidGoofenspiel(gameId: $gameId, pileCardId: $pileCardId)
          }
        `,
        variables: {
          gameId: this.gameId,
          pileCardId: pileCard.id
        }
      })

      await this.$apollo.queries.game.refetch()
    },
    async createGoofenspiel() {
      const response = await this.$apollo.mutate({
        mutation: gql`
          mutation($pack: ID!) {
            createGoofenspiel(pack: $pack)
          }
        `,
        variables: {
          pack: this.game.pack.id
        }
      })

      const gameId = response.data.createGoofenspiel
      this.$router.push(`/games/${gameId}`)
    }
  },
  middleware: ['guest']
}
</script>

<style scoped lang="scss">
.transform-flip-y {
  transform: rotate(180deg);
}

.sortable-chosen {
  transform: scale(1.5) !important;
}

.sortable-fallback {
  @apply hidden;
}
</style>
