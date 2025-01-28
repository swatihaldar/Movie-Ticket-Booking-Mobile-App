<template>
  <div class="carousel">
    <div
      v-for="(slide, index) in slides"
      :key="slide.id"
      class="slide"
      :style="{ backgroundImage: `url(${slide.image})` }"
      :class="{ active: currentSlide === index }"
      @transitionend="onTransitionEnd"
    >
      <div class="overlay">
        <h2
          class="movie-title"
          :class="{ 'animate-title': currentSlide === index }"
        >
          {{ slide.title }}
        </h2>

        <div class="info">
          <p
            class="description"
            :class="{ 'animate-description': currentSlide === index }"
          >
            {{ slide.description }}
          </p>
          <p>
            <strong class="label">Genre:</strong>
            <span
              class="genre"
              :class="{ 'animate-genre': currentSlide === index }"
            >
              {{ slide.genre }}
            </span>
          </p>
          <p>
            <strong class="label">Director:</strong>
            <span
              class="director"
              :class="{ 'animate-director': currentSlide === index }"
            >
              {{ slide.director }}
            </span>
          </p>
          <p>
            <strong class="label">Language:</strong>
            <span
              class="language"
              :class="{ 'animate-language': currentSlide === index }"
            >
              {{ slide.language }}
            </span>
          </p>
          <a class="movie-list" href="http://localhost:8080/frontend/movies"
            >View More</a
          >
        </div>
      </div>
    </div>

    <!-- Navigation Buttons -->
    <button class="prev" @click="prevSlide">❮</button>
    <button class="next" @click="nextSlide">❯</button>
  </div>
</template>






<script>
export default {
  data() {
    return {
      slides: [
        {
          id: 1,
          title: 'Mufasa: The Lion King',
          description:
            'Lost and alone, orphaned cub Mufasa meets a sympathetic lion named Taka, the heir to a royal bloodline. The chance meeting sets in motion an expansive journey of an extraordinary group of misfits searching for their destinies.',
          director: 'Barry Jenkins',
          genre: 'Adventure, Animation, Drama',
          language: 'English',
          image:
            'https://media.assettype.com/indulgexpress%2F2024-04%2F9d0fb46b-da54-4545-b1a2-85d348905785%2FUntitled_design__11_.jpg',
        },
        {
          id: 2,
          title: 'Thunderbolts',
          description:
            'Thunderbolts* is an upcoming superhero film, based on the Marvel Comics team of the same name. The film is a sequel to Ant-Man and the Wasp, The Falcon and The Winter Soldier and Black Widow. It is the thirty-sixth film in the Marvel Cinematic Universe and the fifteenth installment of Phase Five.',
          director: '	Jake Schreier',
          genre: 'Action , Adventure , Crime , Drama.',
          language: 'English',
          image:
            'https://static0.srcdn.com/wordpress/wp-content/uploads/2024/10/alexei-shostakov-ava-starr-bucky-barnes-yelena-belova-and-john-walker-in-an-elevator-in-thunderbolts.jpg',
        },
        {
          id: 3,
          title: 'Raid 2',
          description:
            'After surviving a bloody fight with powerful gangsters, rookie Jakarta cop Rama (Iko Uwais) thinks he can resume a normal life. However, his exploits during that fateful incident have attracted the attention of criminals even more deadly than the last. His family at risk, Rama has no choice but to go under cover. He gets himself thrown in prison, where he befriends the son of a prominent crime kingpin. Rama must lay his own life on the line to finally destroy the criminal empire.',
          director: 'Gareth Evans',
          genre: ' Action,Thriller',
          language: 'Hindi',
          image:
            'https://assets.telegraphindia.com/telegraph/2024/Dec/1733292496_new-project-8.jpg',
        },
        {
          id: 4,
          title: 'Moana 2',
          description:
            'Moana journeys to the far seas of Oceania after receiving an unexpected call from her wayfinding ancestors.',
          director: ' Dana Ledoux Miller, Jason Hand, David Derrick Jr.',
          genre: 'Adventure, Animated, Comedy, Family, Fantasy',
          language: 'English',
          image:
            'https://static1.srcdn.com/wordpress/wp-content/uploads/2024/05/moana-2.jpg?q=70&fit=crop&w=1140&h=&dpr=1',
        },
      ],
      currentSlide: 0,
      isDescriptionVisible: false,
    }
  },
  methods: {
    nextSlide() {
      this.isDescriptionVisible = false
      this.currentSlide = (this.currentSlide + 1) % this.slides.length

      setTimeout(() => {
        this.isDescriptionVisible = true
      }, 2000)
    },
    prevSlide() {
      this.isDescriptionVisible = false
      this.currentSlide =
        (this.currentSlide - 1 + this.slides.length) % this.slides.length

      setTimeout(() => {
        this.isDescriptionVisible = true
      }, 2000)
    },
    goToMovieList() {
      window.location.href = 'http://localhost:8080/frontend/movies'
    },
  },
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  overflow-x: hidden;
}

.carousel {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

/* Individual Slides */
.slide {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}

.slide.active {
  opacity: 1;
}

/* Overlay for Text with Red and Black Gradient */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, rgb(0, 0, 0), rgba(212, 138, 138, 0.5));
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Title Animation */
.movie-title {
  font-size: 4rem;
  margin-bottom: 1rem;
  color: aliceblue;
  text-shadow: rgba(0, 0, 0, 0.8) 2px 2px;
  transform: translateX(-100%);
  transition: transform 1s ease-out;
  padding-left: 3rem;
}

.movie-title.animate-title {
  transform: translateX(0);
}

/* Description Styling */
.description {
  font-size: 1.3rem;
  margin-bottom: 1rem;
  padding-left: 3rem;
  padding-bottom: 1.5rem;
  /* border-radius: 1rem; */
  width: 50%;
  transform: translateY(100%);
  transition: transform 0.6s ease-out;
  opacity: 0;
  bottom: 40px;
  left: 20px;
}

.description.animate-description {
  transform: translateY(0);
  opacity: 1;
}

/* Label Styling */
.label {
  color: red;
  font-size: 1rem;
  padding-left: 3rem;
}

/* Genre, Director, Language Animation */
.genre,
.director,
.language {
  color: white;
  font-size: 1.1rem;
  transform: translateX(-100%);
  transition: transform 1s ease-out;
}

.genre.animate-genre,
.director.animate-director,
.language.animate-language {
  transform: translateX(0);
  opacity: 1;
}

/* Navigation Buttons */
button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 0.75rem;
  font-size: 0.75rem;
  cursor: pointer;
  z-index: 2;
}

button:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.prev {
  left: 5%;
}

.next {
  right: 5%;
}

.movie-list {
  display: inline-block;
  margin-top: 1rem;
  margin-left: 3rem;
  padding: 0.6rem 1.5rem;
  font-size: 1rem;
  background-color: rgb(224, 4, 4);
  color: white;
  font-weight: 800;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.movie-list:hover {
  background-color: darkred;
  transform: scale(1.05);
}
</style>






