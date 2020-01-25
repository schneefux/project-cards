<template>
  <div>
    <div class="py-20 bg-gradient-r-dark-to-secondary">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold mb-2 text-white">[Projektname]</h2>
        <h3 class="text-2xl mb-8 text-gray-100">Designe Lernkarten und spiele sie mit Freunden.</h3>

        <nuxt-link to="/games" class="bg-white hover:bg-secondary-100 button--xl">Online spielen</nuxt-link>
      </div>
    </div>

    <section class="container mx-auto px-6 p-10">
      <h2 class="text-4xl font-bold text-center text-gray-800 mb-8">Features</h2>

      <div class="feature">
        <div class="w-full md:w-1/2">
          <h4 class="feature__heading">Karten-Designer</h4>
          <p class="feature__text">Erstelle Lernkarten mit Bildern und Text.</p>
        </div>
        <div class="w-full md:w-1/2">
          <PlayingCardsIllustration />
        </div>
      </div>

      <div class="feature">
        <div class="w-full md:w-1/2">
          <GameDayIllustration />
        </div>
        <div class="w-full md:w-1/2 pl-10">
          <h4 class="feature__heading">Online-Spiel</h4>
          <p
            class="feature__text"
          >Fordere Fremde und Freunde heraus. Lernt gemeinsam interessante Fakten über die Welt.</p>
        </div>
      </div>

      <div class="feature">
        <div class="w-full md:w-1/2 pl-10">
          <h4 class="feature__heading">Druck sie aus</h4>
          <p class="feature__text">Druck deine Kartenspiele aus und lerne überall.</p>
          <div class="block -mt-6 mb-6">
            <span
              class="bg-primary-400 text-white px-2 pt-px pb-1 rounded-full text-xs font-semibold tracking-wide"
            >geplant</span>
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <PrintInvoiceIllustration />
        </div>
      </div>
    </section>

    <section class="bg-primary-500">
      <div class="container mx-auto px-6 text-center py-20">
        <h2 class="mb-6 text-4xl font-bold text-center text-white">Probier es kostenlos aus</h2>
        <h3 class="my-4 text-2xl text-white">Erstelle dein erstes Lernkartenspiel</h3>
        <nuxt-link
          to="/register"
          class="bg-white hover:bg-primary-100 button--xl mt-6 inline-block"
        >Registrieren</nuxt-link>
      </div>
    </section>
  </div>
</template>

<script>
import PlayingCardsIllustration from '~/assets/images/playing-cards.svg'
import GameDayIllustration from '~/assets/images/game-day.svg'
import PrintInvoiceIllustration from '~/assets/images/print-invoice.svg'

export default {
  components: {
    PlayingCardsIllustration,
    GameDayIllustration,
    PrintInvoiceIllustration
  }
}
</script>

<style lang="scss" scoped>
.feature {
  @apply flex items-center flex-wrap mb-20;

  &__heading {
    @apply text-3xl text-gray-800 font-bold mb-3;
  }

  &__text {
    @apply text-gray-600 mb-8;
  }
}
</style>
