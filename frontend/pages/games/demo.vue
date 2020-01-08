<template>
  <div class="container container--page">
    <h1 class="page-heading">Game Client Demo</h1>

    <div class="w-full" v-for="side in 2" :key="side" :class="{ 'transform-flip-y': side == 1 }">
      <div
        class="relative w-full h-40 rounded-b-lg"
        :class="{ 'bg-secondary-500': side == 1, 'bg-primary-500': side == 2 }"
      >
        <template v-if="side == 2">
          <draggable v-model="cards" :group="`cards-${side}`" class="flex justify-center">
            <div
              v-for="card in cardsPrice"
              :key="card"
              :style="
              `
              margin-top: -${(CENTER_CARD_W * CARD_RATIO) / 2}rem;
              margin-left: ${CENTER_CARD_W / 4}rem;
              margin-right: ${CENTER_CARD_W / 4}rem;
              width: ${CENTER_CARD_W}rem;
              height: ${CENTER_CARD_W * CARD_RATIO}rem;
              `
            "
              class="playingcard__container"
            >{{ card }}</div>
          </draggable>
        </template>
      </div>
      <div
        class="border border-gray-700 relative mx-auto rounded-full flex justify-center"
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
            grid-template-columns: repeat(${cards.length * HAND_CARD_OVERLAP}, 1fr);
            transition: all 0.3s;
            ${spread || side == 1 ? `padding-right: ${HAND_CARD_W / 2}rem;` : ''}
            ${spread || side == 1 ? '' : `margin-right: calc(-50vw + 50%);`}
            ${spread || side == 1 ? '' : `margin-left: calc(-50vw + 50%);`}
          `"
          class="h-full"
          @start="spread = false"
          @end="spread = true"
        >
          <div
            v-for="(card, index) in cards"
            :key="card"
            :style="
              `
              grid-column: auto / span ${HAND_CARD_OVERLAP};
              grid-row: 1;
              width: ${HAND_CARD_W}rem;
              height: ${HAND_CARD_W * CARD_RATIO}rem;
              transition: all 0.3s;
              ${spread || side == 1 ? `transform: rotate(${-30 + ((index + 0.5) / cards.length) * 60}deg);` : ''}
              ${spread || side == 1 ? `margin-top: ${Math.abs(index + 0.5 - cards.length / 2) / 2}rem;` : ''}
              ${spread || side == 1 ? '' : 'transform: scale(1.2);'}
              ${spread || side == 1 ? '' : 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'}
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
      cardsPrice: ['price 1', 'price 2'],
      CARD_RATIO: 9 / 6,
      CENTER_CARD_W: 4,
      HAND_CARD_W: 4,
      HAND_SPACE_W: 20,
      HAND_SPACE_H: 8,
      HAND_CARD_OVERLAP: 4,
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
