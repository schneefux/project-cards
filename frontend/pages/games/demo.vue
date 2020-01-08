<template>
  <div class="container container--page">
    <h1 class="page-heading">Game Client Demo</h1>

    <div class="w-full" v-for="side in 2" :key="side" :class="{ 'transform-flip-y': side == 1 }">
      <div
        class="relative w-full h-40 rounded-b-lg"
        :class="{ 'bg-secondary-500': side == 1, 'bg-primary-500': side == 2 }"
      >
        <template v-if="side == 2">
          <div
            v-for="n in cardsPrice"
            :key="n"
            class="playingcard__container"
            :style="
              `
              position: absolute;
              left: calc(50% - ${CENTER_CARD_W / 2}rem - ${(n -
                1 +
                0.5 -
                cardsPrice / 2) *
                CENTER_CARD_W *
                1.5}rem);
              width: ${CENTER_CARD_W}rem;
              top: -${(CENTER_CARD_W * CARD_RATIO) / 2}rem;
              height: ${CENTER_CARD_W * CARD_RATIO}rem;
              `
            "
          ></div>
        </template>
      </div>
      <div
        class="border border-gray-700 relative mx-auto rounded-full flex"
        :class="{ 'bg-secondary-500': side == 1, 'bg-primary-500': side == 2 }"
        :style="
          `
        width: ${HAND_SPACE_W}rem;
        height: ${HAND_SPACE_H}rem;
        `
        "
      >
        <draggable
          v-model="cards"
          :group="`cards-${side}`"
          :style="`
            margin-top: -5rem;
            display: grid;
            grid-template-columns: repeat(${cards.length * 4}, 1fr);
          `"
          class="mx-auto h-full"
          @start="spread = false"
          @end="spread = true"
        >
          <!-- TODO find an alternative to commenting out spread styles -->
          <div
            v-for="(card, index) in cards"
            :key="`${card}`"
            :style="
              `
              grid-column: auto / span 4;
              grid-row: 1;
              width: ${HAND_CARD_W}rem;
              height: ${HAND_CARD_W * CARD_RATIO}rem;
              ${spread ? '' : '/*'}
              transform: rotate(${-30 + ((index + 0.5) / cards.length) * 60}deg);
              ${spread ? '' : '*/'}
              ${spread ? '' : '/*'}
              margin-top: ${Math.abs(index + 0.5 - cards.length / 2) / 2}rem;
              ${spread ? '' : '*/'}
            `
            "
            class="playingcard__container"
          >{{ card }}</div>
        </draggable>
        <p
          class="text-center w-full absolute font-semibold"
          :class="{ 'transform-flip-y': side == 1 }"
          style="top: 50%"
        >1234 Punkte</p>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  data() {
    return {
      cards: [
        'card 1',
        'card 2',
        'card 3',
        'card 4',
        'card 5',
        'card 6',
        'card 7',
        'card 8',
        'card 9'
      ],
      cardsPrice: 2,
      CARD_RATIO: 9 / 6,
      CENTER_CARD_W: 4,
      HAND_CARD_W: 4,
      HAND_SPACE_W: 20,
      HAND_SPACE_H: 8,
      dragging: undefined,
      spread: true
    }
  },
  components: {
    draggable
  },
  computed: {},
  methods: {}
  //middleware: ['guest']
}
</script>

<style scoped lang="scss">
.transform-flip-y {
  transform: rotate(180deg);
}

.sortable-chosen {
  transform: scale(1.5) !important;
}
</style>
