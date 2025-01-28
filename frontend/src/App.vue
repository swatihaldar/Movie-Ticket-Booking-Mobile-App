<template>
  <div id="app">
    <Menu /> 
    <!-- <HomePage /> -->
    <router-view />
  </div>
</template>

<script>
import Menu from './pages/Menu.vue';
import HomePage from './pages/HomePage.vue'

export default {
  components: { Menu, HomePage },
};
</script>

<style>
body {
  margin: 0;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
}
</style>
