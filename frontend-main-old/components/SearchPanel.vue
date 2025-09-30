<template>
  <div class="SearchPanel">
    <p class="title">
      Search Filters 
    </p>

    <form @submit.prevent="applyFilters">
      <div class="filters">
        <label>
          SKU
          <input v-model="filters.sku" type="text" placeholder="RZ16-3090" />
        </label>

        <label>
          Min price
          <input v-model.number="filters.priceMin" type="number" min="0" step="any" placeholder="100" />
        </label>

        <label>
          Max price
          <input v-model.number="filters.priceMax" type="number" min="0" step="any" placeholder="1000" />
        </label>

        <label>
          Category
          <select v-model="filters.category">
            <option disabled value="">Select</option>
            <option v-for="item in categories" :key="item.code" :value="item.code">{{ item.label }}</option>
          </select>
        </label>

        <label>
          Brand
          <input v-model="filters.brand" type="text" placeholder="Samsung" />
        </label>

        <label>
          Model
          <input v-model="filters.model" type="text" placeholder="Pro 16" />
        </label>

        <label>
          Condition
          <select v-model="filters.condition">
            <option disabled value="">Select</option>
            <option value="new">New</option>
            <option value="used">Used</option>
            <option value="refurbished">Refurbished</option>
          </select>
        </label>

        <label>
          Min discount
          <input v-model.number="filters.discountPercentMin" type="number" min="0" max="100" placeholder="%" />
        </label>

        <div v-if="errorMessage" class="error">{{ errorMessage }}</div>

        <div class="actions">
          <button type="submit">Apply Filters</button>
          <button class="clear" type="button" @click="resetFilters">Clear</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import categoryList from "@/assets/json/categories.json"
import { z } from 'zod'

const search = useSearchStore()

const emit = defineEmits<{
  (e: 'onApply'): void
  (e: 'onClear'): void
}>()

const categories = computed(() =>
  Object.values(categoryList).map(category => ({
    label: category.label,
    code: category.code,
  }))
)

type Condition = 'new' | 'used' | 'refurbished';

interface ProductSearchFilters {
  sku?: string;
  priceMin?: number;
  priceMax?: number;
  category?: string;
  brand?: string;
  model?: string;
  condition?: Condition;
  discountPercentMin?: number;
}

const router = useRouter();
const route = useRoute();

const filters = ref<ProductSearchFilters>({});
const errorMessage = ref<string | null>(null);

const filterSchema = z.object({
  sku: z.string().optional(),
  priceMin: z.coerce.number().optional(),
  priceMax: z.coerce.number().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  condition: z.enum(['new', 'used', 'refurbished']).optional(),
  discountPercentMin: z.coerce.number().min(0).max(100).optional()
});

onMounted(() => {
  const parsed = filterSchema.safeParse(route.query);
  if (parsed.success) {
    filters.value = parsed.data;
    storeFilterNumber()
  } else {
    console.warn("Invalid parameters in the URL", parsed.error);
  }
});

function storeFilterNumber(){
  search.setFilters(Object.keys(filters.value).length)
}

function applyFilters() {
  errorMessage.value = null;

  const f = filters.value;

  if (f.priceMin !== undefined && f.priceMax !== undefined && f.priceMin > f.priceMax) {
    errorMessage.value = 'The minimum price cannot be greater than the maximum.';
    return;
  }

  const query: Record<string, string> = {};

  Object.entries(f).forEach(([key, val]) => {
    if (val !== undefined) {
      query[key] = String(val);
    }
  });

  router.push({ name: 'country-s', params: { ...route.params }, query: { ...route.query, ...query } });

  storeFilterNumber()

  emit('onApply');
}

function resetFilters() {
  filters.value = {};
  const cleanedQuery = { ...route.query };
  Object.keys(cleanedQuery).forEach((key) => {
    if (filterSchema.shape[key as keyof typeof filterSchema.shape]) {
      delete cleanedQuery[key];
    }
  });

  router.push({ query: cleanedQuery });

  storeFilterNumber()
  
  emit('onClear');
}
</script>

<style scoped>
.SearchPanel {
  box-sizing: border-box;
  min-height: 100vh;
  overflow-y: auto;
  padding: 1.5rem;
  height: 100%;
  width: 100%;
}

.title{
  font-size: var(--text-size-3);
  margin-bottom: 2rem;
  font-weight: 700;
}

.filters {
  width: 100%;
  display: grid;
  gap: 1rem;
  box-sizing: border-box;
}

label {
  display: flex;
  font-weight: 700;
  color: var(--text-a);
  flex-direction: column;
  font-size: var(--text-size-0);
}

input,
select {
  width: 100%;
  margin-top: 0.5rem;
  box-sizing: border-box;
  padding: 0.75rem 0.75rem;
  font-size: var(--text-size-1);
  border: 1px solid var(--border-a);
  border-radius: var(--input-radius);
  transition: var(--transition-a);
  background: var(--background-a);
}

select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 20 20' fill='currentColor' class='chevron-down' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' d='M5.23 7.21a.75.75 0 011.06.02L10 10.585l3.71-3.355a.75.75 0 111.04 1.08l-4 3.615a.75.75 0 01-1.04 0l-4-3.615a.75.75 0 01.02-1.06z' clip-rule='evenodd'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 1rem;
}

select {
  font-size: var(--text-size-1);
}

select option {
  font-size: var(--text-size-0);
}

input::placeholder {
  font-size: var(--text-size-1);
  opacity: 0.7;
}

input:focus::placeholder {
  color: transparent;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--primary-a);
}

.actions {
  gap: 1rem;
  display: flex;
  justify-content: flex-end;
}

button {
  border: 1px solid var(--primary-a);
  transition: var(--transition-a);
  border-radius: var(--radius-f);
  background: var(--primary-a);
  padding: 0.75rem 1rem;
  color: var(--text-w);
  font-weight: 600;
  cursor: pointer;
}

button:hover {
  color: var(--text-w);
  opacity: 0.8;
}

.clear{
  color: var(--primary-a);
  background: transparent;
  border: 1px solid var(--primary-a);
}

.clear:hover{
  color: var(--primary-a);
}

.error {
  color: #dc2626;
  font-size: 0.9rem;
  font-weight: 500;
  background-color: #fee2e2;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
}
</style>
