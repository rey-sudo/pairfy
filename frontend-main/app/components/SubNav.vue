<template>
  <nav class="navbar">
    <div class="navbar-content">
      <div class="categories">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="lucide lucide-menu-icon lucide-menu"
        >
          <path d="M4 5h16" />
          <path d="M4 12h16" />
          <path d="M4 19h16" />
        </svg>
        <span style="margin-left: 0.75rem">All Categories</span>
      </div>
      <ul class="menu">
        <li v-for="(item, index) in menu" :key="index" class="menu-item">
          <span>{{ item.name }}</span>

          <!-- Submenú -->
          <ul v-if="item.children" class="submenu">
            <li
              v-for="(child, i) in item.children"
              :key="i"
              class="submenu-item"
            >
              {{ child }}
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref } from "vue";

const menu = ref([
  {
    name: "Electronics & Devices",
    children: ["Phones", "Laptops", "Tablets", "Accessories"],
  },
  {
    name: "Digital Content & Software",
    children: ["Cars", "Motorcycles", "Trucks"],
  },
  { name: "Clothing & Fashion", children: ["Men", "Women", "Kids"] },
  {
    name: "Footwear",
    children: ["Perfumes", "Makeup", "Personal Care"],
  },
  { name: "Jewelry & Watches", children: ["Furniture", "Decor", "Kitchen"] },

  { name: "Health, Wellness & Beauty" },
  { name: "Books, Music & Movies", children: [] },
  { name: "More", children: [] },
]);
</script>

<style scoped>
.navbar {
  width: 100%;
  display: flex;
  padding-bottom: 1rem;
  justify-content: center;
  font-size: var(--font-size-2);
  box-sizing: border-box;
  white-space: nowrap;
  font-weight: 400;
}

.navbar-content {
  width: 100%;
  display: flex;
  align-items: center;
  max-width: var(--body);
  box-sizing: border-box;
}

.categories {
  align-items: center;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  margin-right: 2rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-5);
  background: var(--background-1);
}

.menu {
  gap: 2rem;
  margin: 0;
  padding: 0;
  width: 100%;
  display: flex;
  list-style: none;
  max-width: var(--body);
  justify-content: flex-start;
  overflow: hidden;
  overflow-x: auto;
}

.menu::-webkit-scrollbar {
  display: none;
}

.menu {
  -ms-overflow-style: none;
  scrollbar-width: 2rem;
}

.menu-item {
  color: var(--text-0);
  position: relative;
  cursor: pointer;
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
