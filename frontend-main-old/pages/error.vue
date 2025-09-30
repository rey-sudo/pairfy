<!-- pages/error.vue -->
<script setup>
const error = useError()
const router = useRouter()

if (error?.value?.statusCode === 404) {
    router.replace({ path: '/' })
}
</script>

<template>

</template>
