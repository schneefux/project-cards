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
              left: calc(50% - ${CENTER_CARD_W / 2}rem - ${(n - 1 + 0.5 - cardsPrice / 2) * CENTER_CARD_W * 1.5}rem);
              width: ${CENTER_CARD_W}rem;
              top: -${CENTER_CARD_W*CARD_RATIO / 2}rem;
              height: ${CENTER_CARD_W*CARD_RATIO}rem;
              `
            "
          ></div>
        </template>
      </div>
      <div
        class="border border-gray-700 relative mx-auto rounded-full"
        :class="{ 'bg-secondary-500': side == 1, 'bg-primary-500': side == 2 }"
        :style="`
        width: ${HAND_SPACE_W}rem;
        height: ${HAND_SPACE_H}rem;
        `"
      >
        <div
          v-for="n in cardsRed"
          :key="n"
          :style="
            `;
            position: absolute;
            top: -5rem;
            left: calc(50% - ${HAND_CARD_W / 2}rem);
            width: ${HAND_CARD_W}rem;
            height: ${HAND_CARD_W*CARD_RATIO}rem;
            transform-origin: center bottom; \
            transform: \
              translateX(${(n - 1 + 0.5 - cardsRed / 2) * HAND_CARD_W * HAND_SPREAD}rem) \
              rotate(${-30 + ((n - 1 + 0.5) / cardsRed) * 60}deg) \
              translateY(${Math.abs(n - 1 + 0.5 - cardsRed / 2) *
                HAND_CARD_W * CARD_RATIO *
                HAND_SPREAD * HAND_SPACE_H / HAND_SPACE_W / 2}rem) \
          `
          "
          class="playingcard__container"
        >{{ n }}</div>
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
export default {
  data() {
    return {
      cardsRed: 6,
      cardsPrice: 2,
      CARD_RATIO: 9 / 6,
      CENTER_CARD_W: 4,
      HAND_CARD_W: 4,
      HAND_SPACE_W: 20,
      HAND_SPACE_H: 8,
      HAND_SPREAD: 0.5
    }
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
</style>
