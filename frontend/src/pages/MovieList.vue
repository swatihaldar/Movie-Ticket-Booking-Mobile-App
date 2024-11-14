<template>
    <div class="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">List of Movies</h1>

        <ul v-if="movies.data" class="space-y-6">
            <li v-for="movie in movies.data" :key="movie.name" class="flex items-center border-b pb-6">

                <img :src="movie.poster" alt="Movie Poster" class="w-20 h-30 object-cover rounded-md mr-6" />

                <div class="flex flex-col">
                    <router-link 
                        :to="{ name: 'MovieDetails', params: { movieName: movie.name } }" 
                        class="text-xl font-semibold text-blue-600 hover:text-blue-800 transition-all"
                    >
                        {{ movie.title }}
                    </router-link>

                    <p class="text-sm text-gray-500 mt-2">{{ movie.director }} | {{ movie.release_date }}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup>
import { createListResource } from 'frappe-ui';

const movies = createListResource({
    doctype: 'Movie',
    fields: ['name', 'title', 'release_date', 'director', 'poster'],
    auto: true,
});
</script>

<style scoped>

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: flex;
    align-items: center;
}

li img {
    border-radius: 8px;
}

a:hover {
    text-decoration: underline;
}
</style>
