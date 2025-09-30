<template>
  <nav class="HeaderContent">
    <div class="HeaderContent-body">

      <div class="left-column flex">
        <img class="icon" src="@/assets/brand/icon-white.svg" alt="" @click="navigateTo('/')">

        <ul class="HeaderContent-nav">
          <li v-for="item in items" :key="item.label" @click="navigateTo(item.route, item.external)">
            {{ item.label }}
          </li>
        </ul>
      </div>

      <div class="center-column flex center">
        <HeaderSearch />
      </div>

      <div class="right-column flex end">
        <ClientOnly>
          <HeaderConnect v-if="!auth.isAuthenticated" />
          <HeaderAvatar v-if="auth.isAuthenticated" />
        </ClientOnly>
      </div>

    </div>
  </nav>
</template>


<script setup lang="ts">
const auth = useAuthStore()

const items = ref([
  { label: 'Github', route: 'https://github.com/Pairfy-DAO/pairfy', external: true },
  { label: 'Discord', route: 'https://discord.gg/qEdn9m3VUJ', external: true },
  { label: 'Docs', route: 'https://docs.pairfy.io/', external: true },
  { label: 'Sellers', route: 'https://seller.pairfy.io/', external: true }
])

const router = useRouter()
const route = useRoute()
const activeRoute = ref(route.path)

const navigateTo = (path: string, external?: boolean) => {
  if (external) {
    window.open(path, '_blank', 'noopener,noreferrer');
    return
  }

  if (path !== route.path) {
    router.push(path)
  }

}

watch(() => route.path, (newPath) => {
  activeRoute.value = newPath
})
</script>

<style scoped>
.icon {
  height: 2.5rem;
}

.HeaderContent {
  justify-content: center;
  box-sizing: border-box;
  color: var(--text-w);
  align-items: center;
  display: flex;
  width: 100%;
  top: 2rem;
  position: initial;
  background: var(--blue-b);
}

.HeaderContent-body {
  gap: 1rem;
  display: grid;
  width: inherit;
  color: inherit;
  font-weight: 500;
  padding: 0.75rem 0;
  align-items: center;
  box-sizing: border-box;
  max-width: var(--body-a);
  grid-template-columns: 1fr 2fr 0.5fr;
}

.HeaderContent-nav {
  align-items: center;
  list-style: none;
  padding: 0 1rem;
  width: inherit;
  display: flex;
  gap: 1rem;
  margin: 0;
}

.HeaderContent-body li {
  cursor: pointer;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-f);
  transition: var(--transition-a);
}

.HeaderContent-body li:hover {
  background: rgba(255, 255, 255, 0.1);
}

.HeaderContent-body li:hover {
  background: rgba(255, 255, 255, 0.05);
}
</style>



<style scoped>
@media (max-width: 480px) {
  .HeaderContent-nav {
    display: none;
  }

  .HeaderContent-body {
    padding: 0.5rem;
    grid-template-columns: 0.1fr 1fr 0.1fr;
  }
}

@media (min-width: 481px) and (max-width: 767px) {}

@media (min-width: 768px) and (max-width: 991px) {}

@media (min-width: 992px) and (max-width: 1199px) {}

@media (min-width: 1200px) and (max-width: 1599px) {}

@media (min-width: 1600px) {}
</style>