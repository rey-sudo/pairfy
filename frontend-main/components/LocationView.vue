<template>
  <div class="country-selector">
    <div class="title flex">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
        class="lucide lucide-map-pin-icon lucide-map-pin">
        <path
          d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
        <circle cx="12" cy="10" r="3" />
      </svg>
      <span>Choose a country.</span>
    </div>
    <div class="subtitle">
      <span>Hello! Service availability will be expanded in accordance with DAO
        governance. Thank you for your understanding.</span>
    </div>
    <div class="button-group">
      <button class="country-button" @click="selectCountry('us')">
        <span class="flag flex">
          <img :src="US" alt="">
        </span>
        <div class="country-info">
          <div class="country-name">United States</div>
          <div class="language">English</div>
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import US from '@lovelacers/common-f/public/us.svg';

const auth = useAuthStore()

const route = useRoute()
const router = useRouter()

const selectCountry = (code) => {
  auth.setLocation(code)

  router.replace({
    name: 'country',
    params: { country: code },
    query: { ...route.query }
  })

  window.location.reload()
};
</script>

<style scoped>
.country-selector {
  max-width: 500px;
  padding: 1.5rem;
  margin: auto;
}

.button-group {
  gap: 1rem;
  display: flex;
  flex-wrap: wrap;
}

.country-button {
  gap: 1rem;
  display: flex;
  cursor: pointer;
  align-items: center;
  padding: 0.5rem 1rem;
  transition: background 0.2s;
  border-radius: var(--radius-b);
  background: var(--background-a);
  border: 1px solid var(--border-b);
}

.country-button:hover {
  background: var(--background-b);
}

.country-info {
  text-align: left;
}

.country-name {
  font-size: var(--text-size-1);
  font-weight: 700;
}

.language {
  font-size: var(--text-size-0);
  color: var(--text-b);
}

.title {
  font-size: var(--text-size-4);
  font-weight: 700;
}

.title svg {
  margin-right: 0.5rem;
}

.subtitle {
  font-size: var(--text-size-1);
  line-height: 1.5rem;
  color: var(--text-b);
  margin: 1rem 0;
}

.language {
  margin-top: 0.25rem;
}

.flag {
  width: 2rem;
}

.flag img {
  width: 100%;
}
</style>