<template>
  <div 
    class="background-img bg-cover bg-center min-h-screen p-6" 
    :style="{ backgroundImage: `url('https://static1.colliderimages.com/wordpress/wp-content/uploads/2024/09/screenshot-2024-09-23-at-11-10-32-am.png')` }"
  >
    <!-- Title for Latest Shows -->
    <h1 class="text-2xl font-bold text-white mb-6 text-center mt-20">Latest Shows</h1>
    <div class="slider-container">
      <div v-if="latestMovies.length" class="movie-grid">
        <router-link 
          v-for="movie in latestMovies" 
          :key="movie.name" 
          :to="{ name: 'MovieDetails', params: { movieName: movie.name } }" 
          class="movie-card"
        >
          <div class="image-wrapper">
            <img 
              :src="movie.poster" 
              :alt="`Poster of ${movie.title}`" 
              class="w-full h-full object-cover"
            />
            <div class="overlay">
              <h2 class="text-2xl font-semibold text-white">
                {{ movie.title }}
              </h2>
              <p class="text-sm text-gray-300 mt-2">
                {{ movie.director }} | {{ movie.release_date }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
      <p v-else class="text-white text-center mt-10">No latest shows available at the moment.</p>
    </div>

    <!-- Title for Upcoming Movies -->
    <h1 class="text-2xl font-bold text-white mb-6 text-center mt-20">Upcoming Shows</h1>
    <div class="slider-container">
      <div v-if="upcomingMovies.length" class="movie-grid">
        <router-link 
          v-for="movie in upcomingMovies" 
          :key="movie.name" 
          :to="{ name: 'MovieDetails', params: { movieName: movie.name } }" 
          class="movie-card"
        >
          <div class="image-wrapper">
            <img 
              :src="movie.poster" 
              :alt="`Poster of ${movie.title}`" 
              class="w-full h-full object-cover"
            />
            <div class="overlay">
              <h2 class="text-2xl font-semibold text-white">
                {{ movie.title }}
              </h2>
              <p class="text-sm text-gray-300 mt-2">
                {{ movie.director }} | {{ movie.release_date }}
              </p>
            </div>
          </div>
        </router-link>
      </div>
      <p v-else class="text-white text-center mt-10">No upcoming movies available at the moment.</p>
    </div>
  </div>
</template>

<script setup>
import { createListResource } from 'frappe-ui';
import { computed } from 'vue';

const movies = createListResource({
  doctype: 'Movie',
  fields: ['name', 'title', 'release_date', 'director', 'poster', 'status'],
  auto: true,
});

const categorizedMovies = computed(() => {
  const categories = { latest: [], upcoming: [] };
  movies.data?.forEach(movie => {
    if (movie.status === 'In Theatre') categories.latest.push(movie);
    if (movie.status === 'Upcoming') categories.upcoming.push(movie);
  });
  return categories;
});

const latestMovies = computed(() => categorizedMovies.value.latest);
const upcomingMovies = computed(() => categorizedMovies.value.upcoming);


</script>

<style scoped>
.bg-cover {
  background-size: cover;
  background-attachment: fixed;
}

.mt-20 {
  margin-top: 5rem;
  font-size: 2rem;
}

.slider-container {
  padding: 0 2rem;
}

.movie-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr); 
  gap: 1rem; 
  justify-content: center;
  /* align-content: center; */
}

.movie-card {
  position: relative;
  width: 250px; 
  height: 350px; 
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.5);
  opacity: 0; 
  transform: translateX(-50px); 
  animation: fadeInSlide 0.5s ease forwards;
}

@keyframes fadeInSlide {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.image-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
}

.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-wrapper:hover img {
  transform: scale(1.05);
}

.overlay {
  position: absolute;
  bottom: -100%;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to top, rgb(0, 0, 0), rgba(255, 0, 0, 0.4));
  color: white;
  padding: 1rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transition: bottom 0.4s ease;
}

.image-wrapper:hover .overlay {
  bottom: 0;
}

.overlay h2 {
  font-size: 1.5rem;
  font-weight: bold;
}

.overlay p {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #f0f0f0;
}


.background-img {
    position: relative;
    background-size: cover;
    background-position: center;
}

.background-img::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, #1e2531, #070608, #ef4444);
    opacity: 0.5; 
    z-index: 1;
}

.background-img > * {
    position: relative;
    z-index: 2; /* Ensures the content stays above the overlay */
}




</style>