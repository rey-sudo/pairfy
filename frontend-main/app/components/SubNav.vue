<template>
  <nav class="navbar">
    <ul class="menu">
      <li
        v-for="(item, index) in menu"
        :key="index"
        class="menu-item"
      >
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
  </nav>
</template>

<script setup>
import { ref } from "vue";

// Configuración del menú: más fácil de escalar
const menu = ref([
  { name: "Tecnología", children: ["Celulares", "Laptops", "Tablets", "Accesorios"] },
  { name: "Vehículos", children: ["Autos", "Motos", "Camiones"] },
  { name: "Moda", children: ["Hombres", "Mujeres", "Niños"] },
  { name: "Coleccionables y Arte" },
  { name: "Deportes", children: ["Fitness", "Ciclismo", "Fútbol"] },
  { name: "Salud y Belleza", children: ["Perfumes", "Maquillaje", "Cuidado personal"] },
  { name: "Hogar y Jardín", children: ["Muebles", "Decoración", "Cocina"] },
  { name: "Ofertas" },
  { name: "Vender" }
]);
</script>

<style>
.navbar {

}

.menu {
  display: flex;
  gap: 2rem;
  list-style: none;
  padding: 1rem 2rem;
  margin: 0;
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
  color: #0073e6; /* azul estilo e-commerce */
}

/* ===== Submenú ===== */
.submenu {
  position: absolute;
  top: 100%;
  left: 0;
  display: none; /* Oculto por defecto */
  flex-direction: column;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 0.5rem 0;
  min-width: 180px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
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

/* Mostrar el submenú al pasar el mouse */
.menu-item:hover > .submenu {
  display: flex;
}
</style>
