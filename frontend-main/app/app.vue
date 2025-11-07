<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>

const appConfig = useAppConfig()

useHead({
  title: appConfig.title,
  meta: [
    { name: 'description', content: 'Lovelacers Cardano e-commerce' },
    { property: 'og:title', content: 'Lovelacers Cardano Marketplace' }
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap' }
  ]
})

</script>

