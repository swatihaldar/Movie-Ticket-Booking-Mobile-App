<template>
  <div
    v-if="!movieResource.loading && movieResource.doc"
    class="background-container"
    :style="{
      backgroundImage: `url(${movieDoc.backgroung_image})`,
    }"
  >
    <div class="title-section">
      <h1 class="movie-title">{{ movieDoc.title }}</h1>
    </div>

    <div class="movie-info-card">
      <div class="info-block">
        <h2 class="movie-info-heading">Director</h2>
        <p class="movie-info-text">{{ movieDoc.director }}</p>
      </div>

      <div class="info-block">
        <h2 class="movie-info-heading">Release Date</h2>
        <p class="movie-info-text">{{ formattedReleaseDate }}</p>
      </div>
    </div>

    <!-- Image gallery -->

    <div class="gallery">
      <img
        :src="movieDoc.image1"
        alt="Image 1"
        class="thumbnail"
        @click="openPopup(0)"
      />
      <img
        :src="movieDoc.image2"
        alt="Image 2"
        class="thumbnail"
        @click="openPopup(1)"
      />
      <img
        :src="movieDoc.image3"
        alt="Image 3"
        class="thumbnail"
        @click="openPopup(2)"
      />
    </div>

    <!-- Popup for displaying full-size image -->
    <div v-if="isModalOpen" class="popup" @click.self="closePopup">
      <span class="close" @click="closePopup">&times;</span>
      <button class="prev" @click="changeSlide(-1)">&#10094;</button>
      <img :src="currentImage" alt="Expanded Image" class="popup-image" />
      <button class="next" @click="changeSlide(1)">&#10095;</button>
    </div>

    <div class="max-w-full">
      <!-- page one -->
      <div class="mx-12" v-if="currentStep === 0">
        <div
          v-if="!movieResource.loading && movieResource.doc"
          class="container"
        >
          <div class="movie-card">
            <div class="poster-section">
              <img
                :src="movieDoc.poster"
                alt="Movie Poster"
                class="movie-poster"
              />

              <div class="w-full flex items-center justify-center">
                <button class="booking-button" @click="currentStep++">
                  Book Ticket
                </button>
              </div>
            </div>

            <div class="details-section">
              <h2 class="text-white text-lg font-bold uppercase">Synopsis</h2>

              <p class="text-gray-200 text-base font-normal">
                {{ movieDoc.sysnopsis }}
              </p>
              <p class="text-gray-300">
                <strong class="text-red-500 font-bold">Rating:</strong>
                <span class="text-yellow-500 font-bold">
                  {{ '★'.repeat(rating) }}
                </span>
              </p>
              <p class="text-gray-300">
                <strong class="text-red-500 font-bold">Genre:</strong>
                {{ movieDoc.genre }}
              </p>
              <p class="text-gray-300">
                <strong class="text-red-500 font-bold">Language:</strong>
                {{ movieDoc.language }}
              </p>

              <p class="text-gray-300">
                <strong class="text-red-500 font-bold">Duration:</strong>
                {{ formattedDuration }}
              </p>

              <!-- add trailer button -->
              <button class="trailer-button" @click="openTrailerModal">
                Watch Trailer
              </button>
            </div>
          </div>
        </div>

        <div v-if="isTrailerModalOpen" class="modal-overlay">
          <div class="modal-content">
            <button class="modal-close-button" @click="closeTrailerModal">
              ✖
            </button>
            <iframe
              :src="youtubeEmbedURL"
              class="youtube-frame"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      </div>

      <!-- page two -->

      <div v-else-if="currentStep === 1" class="seat-selection">
        <h2 class="font-medium text-2xl mt-7 text-white-900 text-center">
          How many seats?
        </h2>

        <div class="seat-buttons flex flex-wrap justify-center gap-4 mt-5">
          <Button
            v-for="index in 8"
            :key="index"
            size="lg"
            :variant="index === bookingData.numberOfSeats ? 'subtle' : 'white'"
            class="shadow-lg seat-button"
            @click="setNumberOfSeats(index)"
          >
            {{ index }}
          </Button>
        </div>
      </div>

      <!-- page three -->

      <div
        v-else-if="currentStep === 2"
        class="show-selection flex flex-col items-center"
      >
        <div class="date-selection flex flex-col items-center space-y-4 mt-8">
          <h2 class="font-medium text-2xl text-white-900 text-center">
            Select Date
          </h2>
          <input
            type="date"
            v-model="bookingData.date"
            class="date-input p-2 border rounded"
          />
        </div>

        <div
          class="cinema-selection flex flex-col items-center space-y-4 mt-10 w-full max-w-md"
        >
          <h2 class="font-medium text-2xl text-white-900 text-center">
            Select Cinema & Show
          </h2>

          <div class="theater-options space-y-6 w-full">
            <div
              v-for="theatre in Object.keys(theaterShows.data)"
              :key="theatre"
              class="theater-card bg-white shadow-lg p-5 rounded-lg text-center"
            >
              <h3 class="text-lg font-bold text-white-800">{{ theatre }}</h3>

              <div
                class="show-buttons flex justify-center flex-wrap gap-4 mt-4"
              >
                <Button
                  v-for="show in theaterShows.data[theatre]"
                  :key="show.name"
                  @click="bookingData.show = show.name"
                  size="sm"
                  :variant="
                    show.name === bookingData.show ? 'subtle' : 'outline'
                  "
                  class="show-button"
                >
                  {{ show.start_time }}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- page four -->

      <div
        v-else-if="currentStep === 3"
        class="select-seats flex flex-col items-center"
      >
        <h2 class="font-medium text-2xl mt-7 text-white-900 text-center">
          Select Seats
        </h2>

        <div class="seat-structure mt-6 p-5 rounded-lg shadow-lg">
          <div
            v-for="row in Object.keys(seatStructure)"
            :key="row"
            class="seat-row flex justify-center space-x-4 mb-4"
          >
            <span
              v-for="seat in seatStructure[row]"
              :key="seat[0]"
              @click="selectSeat(row, seat[0])"
              class="seat flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 transition-all duration-200"
              :class="[
                seat[1] === 'Available'
                  ? 'bg-blue-200 bg-opacity-50 hover:bg-blue-300 hover:bg-opacity-70'
                  : seat[1] === 'Selected'
                  ? 'bg-blue-600 text-white border-blue-800'
                  : 'bg-gray-300 border-gray-400',
                hasSelectedCorrectNumberOfSeats
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer',
              ]"
            >
              {{ row + seat[0] }}
            </span>
          </div>
        </div>
      </div>

      <!-- page five -->

      <div v-else-if="currentStep === 4">
        <div class="w-full flex items-center flex-col mt-7">
          <!-- <h1 class="text-[120px]">🍿</h1> -->
          <!-- <img
            src="./—Pngtree—cartoon movie movie film megaphone_6125871.png"
            alt="Movie Megaphone"
            class="movie-image"
          /> -->

          <!-- <h2 class="movie-title font-medium text-xl mt-7 text-white-900">
            Enjoy the movie!
          </h2> -->
          <p id="last-title">ENJOY THE MOVIE!</p>
        </div>
      </div>
    </div>

    <div class="flex flex-row mt-6 space-x-2 justify-center">
      <Button
        class="mt-5 bg-white-500 text-white hover:bg-white-600"
        size="lg"
        variant="subtle"
        v-if="currentStep !== 0 && currentStep !== 4"
        @click="currentStep--"
      >
        Go Back
      </Button>

      <Button
        class="mt-5 bg-black-500 text-white hover:bg-black-600"
        size="lg"
        variant="solid"
        v-if="currentStep !== 0 && currentStep !== 4"
        :disabled="!nextButtonEnabled"
        @click="handleNextClick()"
      >
        Next
      </Button>
    </div>

    <!-- <div class="gallery">
      <img
        :src="movieDoc.image1"
        alt="Image 1"
        class="thumbnail"
        @click="openPopup(0)"
      />
      <img
        :src="movieDoc.image2"
        alt="Image 2"
        class="thumbnail"
        @click="openPopup(1)"
      />
      <img
        :src="movieDoc.image3"
        alt="Image 3"
        class="thumbnail"
        @click="openPopup(2)"
      />
    </div> -->

    <!-- Popup for displaying full-size image -->
    <!-- <div v-if="isModalOpen" class="popup" @click.self="closePopup">
      <span class="close" @click="closePopup">&times;</span>
      <button class="prev" @click="changeSlide(-1)">&#10094;</button>
      <img :src="currentImage" alt="Expanded Image" class="popup-image" />
      <button class="next" @click="changeSlide(1)">&#10095;</button>
    </div> -->
  </div>
</template>




<script setup>
import { ref, reactive, computed } from 'vue'
import { createDocumentResource, createListResource } from 'frappe-ui'
import confetti from 'canvas-confetti'

const props = defineProps({
  movieName: {
    type: String,
    required: true,
  },
})

// Fetching movie data
const movieResource = createDocumentResource({
  doctype: 'Movie',
  name: props.movieName,
  onSuccess(doc) {
    console.log('Movie fetched successfully:', doc)
  },
  auto: true,
})

// Fetching theater show data
const theaterShows = createListResource({
  doctype: 'Theater Show',
  fields: ['theatre', 'start_time', 'name'],
  auto: true,
  transform: (shows) => {
    const groupedShows = {}
    for (const show of shows) {
      if (!groupedShows[show.theatre]) {
        groupedShows[show.theatre] = []
      }
      groupedShows[show.theatre].push(show)
    }
    return groupedShows
  },
})

// Creating a ticket booking resource
const movieBooking = createListResource({
  doctype: 'Ticket Booking',
  insert: {
    onSuccess() {
      console.log('Booking Created!')
      currentStep.value++
    },
  },
})



// Formate Duration and Date 

const formattedDuration = computed(() => {
  const totalSeconds = movieDoc.value?.duration || 0
  const hours = Math.floor(totalSeconds / 3600) // Convert seconds to hours
  const minutes = Math.floor((totalSeconds % 3600) / 60) // Get remaining minutes
  return `${hours}h ${minutes}min` // Format as 'Xh Ymin'
})

const formattedReleaseDate = computed(() => {
  const releaseDate = movieDoc.value?.release_date;
  if (!releaseDate) return '';

  const date = new Date(releaseDate);
  const day = String(date.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month}, ${year}`;
});


// Seat structure generation
function getSeatStructure(alphabets, numbers) {
  const structure = {}
  for (const alphabet of alphabets) {
    structure[alphabet] = []
    for (const number of numbers) {
      structure[alphabet].push([number, 'Available'])
    }
  }
  return structure
}

const seatStructure = reactive(
  getSeatStructure(['A', 'B', 'C', 'D', 'E'], [1, 2, 3, 4, 5, 6, 7])
)

const today = new Date().toISOString().substr(0, 10)
const currentStep = ref(0)
console.log('steps-', currentStep.value)
const bookingData = reactive({
  numberOfSeats: 1,
  selectedSeats: [],
  date: today,
  show: null,
})

function setNumberOfSeats(n) {
  bookingData.numberOfSeats = n
}

const hasSelectedCorrectNumberOfSeats = computed(() => {
  return bookingData.selectedSeats.length === bookingData.numberOfSeats
})

function selectSeat(row, number) {
  if (hasSelectedCorrectNumberOfSeats.value) {
    return
  }
  const seat = seatStructure[row].find((seat) => seat[0] === number)
  seat[1] = 'Selected'
  bookingData.selectedSeats.push(`${row}${number}`)
}

const movieDoc = computed(() => movieResource.doc)

// Default rating
const rating = ref(4)

const nextButtonEnabled = computed(() => {
  if (currentStep.value === 1) {
    return bookingData.numberOfSeats
  } else if (currentStep.value === 2) {
    return bookingData.date && bookingData.show
  } else if (currentStep.value === 3) {
    return hasSelectedCorrectNumberOfSeats.value
  }
})

function handleNextClick() {
  if (currentStep.value !== 3) {
    currentStep.value++
    return
  }

  // Create booking
  movieBooking.insert.submit({
    movie: props.movieName,
    date: bookingData.date,
    show: bookingData.show,
    selected_seats: JSON.stringify(bookingData.selectedSeats),
    number_of_tickets: bookingData.numberOfSeats,
  })
}

// Modal state management
const isModalOpen = ref(false)
const currentIndex = ref(0)

// Open the popup
function openPopup(index) {
  currentIndex.value = index
  isModalOpen.value = true
}

// Close the popup
function closePopup() {
  isModalOpen.value = false
}

// Change slide left or right
function changeSlide(direction) {
  currentIndex.value = (currentIndex.value + direction + 3) % 3
}

const currentImage = computed(() => {
  return [movieDoc.value.image1, movieDoc.value.image2, movieDoc.value.image3][
    currentIndex.value
  ]
})

function triggerConfetti() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: Math.random() - 0.2 },
  })
}

// watch(() => currentStep.value, (newStep) => {
//   if (newStep === 4) {
//     triggerConfetti();
//   }
// });

if (currentStep.value === 4) {
  triggerConfetti()
}

console.log('current-step', currentStep.value)

// Reactive state for the trailer modal
const isTrailerModalOpen = ref(false)
const youtubeEmbedURL = computed(() => {
  if (!movieDoc.value?.trailer) return ''

  const url = movieDoc.value.trailer

  // Handle full YouTube URLs
  if (url.includes('youtube.com')) {
    const videoId = new URL(url).searchParams.get('v')
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  // Handle shortened YouTube URLs
  if (url.includes('youtu.be')) {
    const videoId = url.split('/').pop().split('?')[0]
    return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
  }

  return '' // Fallback if URL is invalid
})

// Open the Trailer Modal
function openTrailerModal() {
  isTrailerModalOpen.value = true
}

// Close the Trailer Modal
function closeTrailerModal() {
  isTrailerModalOpen.value = false
}

console.log('Trailer URL:', movieDoc.value?.trailer)

// const formattedDuration = computed(() => {
//   const totalSeconds = movieDoc.value?.duration || 0
//   const hours = Math.floor(totalSeconds / 3600) // Convert seconds to hours
//   const minutes = Math.floor((totalSeconds % 3600) / 60) // Get remaining minutes
//   return `${hours}h ${minutes}min` // Format as 'Xh Ymin'
// })

// const formattedReleaseDate = computed(() => {
//   const releaseDate = movieDoc.value?.release_date;
//   if (!releaseDate) return '';

//   const date = new Date(releaseDate);
//   const day = String(date.getDate()).padStart(2, '0');
//   const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
//   const month = monthNames[date.getMonth()];
//   const year = date.getFullYear();

//   return `${day} ${month}, ${year}`;
// });



</script>
