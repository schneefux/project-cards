<template>
  <div class="container container--page">
    <h1 class="page-heading">Game Client Demo</h1>

    <div
      class="w-full"
      v-for="side in 2"
      :key="side"
      :class="{ 'transform-flip-y': side == 1 }"
    >
      <div
        class="relative w-full h-40 rounded-b-lg"
        :class="{ 'bg-secondary-500': side == 1, 'bg-primary-500': side == 2 }"
      >
        <template v-if="side == 2">
          <div
            v-for="n in 2"
            :key="n"
            class="playingcard__container"
            :style="
              `
              position: absolute;
              left: calc(50% - 3rem + ${(n - 1 + 0.5 - cardsPrice / 2) * 7}rem);
              top: -5rem;
              width: 6rem;
              height: 9rem;
              `
            "
          ></div>
        </template>
      </div>
      <div
        class="border border-gray-700 relative mx-auto rounded-full"
        :class="{ 'bg-secondary-500': side == 1, 'bg-primary-500': side == 2 }"
        style="
        width: 20rem;
        height: 8rem;
        "
      >
        <div
          v-for="n in cardsRed"
          :key="n"
          :style="
            `;
            position: absolute;
            top: -4rem;
            left: calc(50% - 2rem);
            width: 4rem;
            height: 6rem;
            transform-origin: center bottom; \
            transform: \
              translateX(${(n - 1 + 0.5 - cardsRed / 2) * 4 * 0.5}rem) \
              rotate(${-30 + ((n - 1 + 0.5) / cardsRed) * 60}deg) \
              translateY(${Math.abs(n - 1 + 0.5 - cardsRed / 2) *
                6 *
                0.05}rem) \
          `
          "
          class="playingcard__container"
        >
          {{ n }}
        </div>
        <p
          class="text-center w-full absolute font-semibold"
          :class="{ 'transform-flip-y': side == 1 }"
          style="top: 50%"
        >
          1234 Punkte
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cardsRed: 8,
      cardsPrice: 2
    }
  },
  computed: {},
  methods: {},
  middleware: ['guest']
}
</script>

<style scoped lang="scss">
.absolute\! {
  position: absolute !important;
}

.transform-flip-y {
  transform: rotate(180deg);
}
</style>
