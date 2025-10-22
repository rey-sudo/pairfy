<template>
  <nav class="navbar">
    <ul class="menu">
      <li v-for="(item, index) in menu" :key="index" class="menu-item">
        <span>{{ item.name }}</span>

        <!-- Submenú -->
        <ul v-if="item.children" class="submenu">
          <li v-for="(child, i) in item.children" :key="i" class="submenu-item">
            {{ child }}
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const menu = ref([
  {
    name: "Technology",
    children: ["Phones", "Laptops", "Tablets", "Accessories"],
  },
  { name: "Vehicles", children: ["Cars", "Motorcycles", "Trucks"] },
  { name: "Fashion", children: ["Men", "Women", "Kids"] },
  { name: "Collectibles & Art" },
  { name: "Sports", children: ["Fitness", "Cycling", "Soccer"] },
  {
    name: "Health & Beauty",
    children: ["Perfumes", "Makeup", "Personal Care"],
  },
  { name: "Home & Garden", children: ["Furniture", "Decor", "Kitchen"] },
  { name: "Deals" },
  { name: "Sell" },
]);
</script>

<style>
.navbar {
}

.menu {
  gap: 2rem;
  margin: 0;
  display: flex;
  list-style: none;
  padding: 1rem 2rem;
  font-size: var(--font-size-1);
}

.menu-item {
  color: var(--text-0);
  position: relative;
  cursor: pointer;
  font-weight: 400;
  transition: color 0.2s ease-in-out;
}

.menu-item:hover {
  color: #0073e6;
}

.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  display: none;
  flex-direction: column;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.submenu-item {
  padding: 0.5rem 1rem;
  white-space: nowrap;
  transition: background 0.2s ease-in-out;
}

.submenu-item:hover {
  background: #f5f5f5;
}

.menu-item:hover > .submenu {
  display: flex;
}
</style>
