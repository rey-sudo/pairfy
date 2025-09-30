<template>
    <div class="HeaderNav">
        <nav class="HeaderNav-body">
            <div>
                <ul class="navigator">
                    <li><a href="https://docs.pairfy.io/DAO.html">How to sell</a></li>
                    <li><a href="https://docs.pairfy.io/architecture.html">How it works</a></li>
                    <li><a href="https://docs.pairfy.io/DAO.html">Governance</a></li>
                    <li><a href="https://discord.com/invite/qEdn9m3VUJ">Community</a></li>
                    <li><a href="https://discord.com/invite/qEdn9m3VUJ">I need Help</a></li>
                </ul>
            </div>

            <div>
                <InboxComp v-model="isOpen">
                    <div class="notification">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell-icon lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
                        <div>{{ authStore.notifications.unseen.length }}</div>
                        <span>All Notifications</span>                 
                    </div>
                </InboxComp>
            </div>

        </nav>
    </div>
</template>

<script setup>
const authStore = useAuthStore()

const isOpen = ref(false);

</script>

<style scoped>
.HeaderNav {
    border-top: 1px solid rgba(255, 255, 255, 0.3);
    background: var(--blue-b);
    justify-content: center;
    box-sizing: border-box;
    padding: 0 1rem;
    height: 2.5rem;
    display: flex;
    width: 100%;
}

.HeaderNav-body {
    display: flex;
    width: inherit;
    align-items: center;
    color: var(--text-w);
    box-sizing: border-box;
    scroll-behavior: smooth;
    max-width: var(--body-a);
    font-size: var(--text-size-0);
    justify-content: space-between;
}

.HeaderNav-body {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

.HeaderNav-body::-webkit-scrollbar {
    display: none;
}

.logo {
    font-size: 1.5rem;
}

.navigator {
    list-style: none;
    display: flex;
    gap: 2rem;
    margin: 0;
    padding: 0;
}

.navigator a {
    text-transform: capitalize;
    text-decoration: none;
    color: var(--text-w);
    white-space: nowrap;
}

.navigator a:hover {
    text-decoration: underline;
}

.notification {
    display: flex;
    cursor: pointer;
    align-items: center;
}

.notification span {
    margin-left: 0.5rem;
}

.notification div{
    border-radius: var(--radius-f);
    background: var(--red-a);
    justify-content: center;
    align-items: center;
    margin-left: 0.5rem;
    font-size: 10px;
    width: 1.25rem;
    display: flex;
    height: 1.25rem;

}
</style>

<style scoped>
@media (max-width: 480px) {}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>