<template>
  <nav class="bg-black bg-opacity-50 p-6 w-full fixed z-10">
    <div class="max-w-6xl mx-auto flex justify-between items-center text-white">
      <!-- Logo -->
      <router-link to="/" class="font-extrabold text-2xl hover:text-red-500">
        MOVIE MATE
      </router-link>

      <div class="space-x-6">
        <router-link to="/" class="text-lg font-bold hover:text-red-500">
          Home
        </router-link>
        <router-link to="/movies" class="text-lg font-bold hover:text-red-500">
          Movie List
        </router-link>
        <router-link
          to="/account/login"
          class="text-lg font-bold hover:text-red-500"
        >
          Login
        </router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* nav a {
  transition: color 0.3s ease, transform 0.3s ease;
}


nav a:hover {
  transform: scale(1.1);
} */

.font-extrabold {
  position: relative;
  font-family: 'Avenir Next', sans-serif;
  font-weight: 900;
  font-size: 1.5rem;
  color: red;
  text-transform: uppercase;
  font-style: italic;
}
</style>
