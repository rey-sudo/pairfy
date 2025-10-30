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
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap' }
  ]
})

</script>

