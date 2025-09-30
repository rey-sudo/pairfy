<template>
    <div class="HeaderAvatar" @click="auth.userDrawer = true">
        <div class="HeaderAvatar-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-user-icon lucide-circle-user"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3"/><path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/></svg>
        </div>

        <p class="HeaderAvatar-name">{{ truncateText(auth.user.pubkeyhash, 20) }}</p>
    </div>
</template>

<script setup>
import { truncateText } from '~/utils/utils'

const auth = useAuthStore()


</script>

<style scoped>
.HeaderAvatar {
    gap: 1rem;
    display: flex;
    cursor: pointer;
    align-items: center;
}

.HeaderAvatar-icon {
    display: flex;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
}

.HeaderAvatar-name {
    font-size: var(--text-size-1);
    font-weight: 400;
}
</style>