<template>
  <div class="flex flex-col min-h-screen">
    <nav
      class="bg-primary-500 px-4 pb-1 md:p-4 flex justify-between items-center flex-wrap sticky top-0 md:static z-50"
    >
      <div class="flex-shrink-0 pt-3 md:py-0 w-full md:w-auto">
        <nuxt-link to="/" class="font-semibold text-xl text-white tracking-tighter">Title Goes Here</nuxt-link>
      </div>
      <div class="w-full md:w-auto">
        <div class="overflow-x-auto overflow-y-hidden scrolling-touch whitespace-no-wrap">
          <div class="py-2 md:py-0">
            <nuxt-link to="/" class="nav-link">Home</nuxt-link>
            <nuxt-link to="/login" class="nav-link">Login</nuxt-link>
            <nuxt-link to="/packs" class="nav-link">Packs</nuxt-link>
          </div>
        </div>
      </div>
    </nav>

    <nuxt class="flex-grow" />

    <footer class="bg-primary-500 py-2 text-sm text-primary-100 text-center leading-normal">
      <p>Copyright goes here</p>
      <p class="text-xs leading-tight">Disclaimer goes here</p>
    </footer>
  </div>
</template>

<style scoped>
.nav-link {
  @apply inline-block mr-4 text-primary-100 border-b border-primary-100 font-medium;
}
</style>
