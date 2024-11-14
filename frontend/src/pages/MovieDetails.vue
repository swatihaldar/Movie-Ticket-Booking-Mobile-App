<template>
  <div v-if="!movieResource.loading && movieResource.doc">
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
        <p class="movie-info-text">{{ movieDoc.release_date }}</p>
      </div>
    </div>

    <div class="max-w-full">
      <!-- page one -->
      <div class="mx-12" v-if="currentStep === 0">
        <div
          v-if="!movieResource.loading && movieResource.doc"
          class="container"
        >
          <div class="movie-card bg-white shadow-2xl rounded p-5">
            <div class="poster-section mb-5">
              <img
                :src="movieDoc.poster"
                alt="Movie Poster"
                class="movie-poster"
              />
            </div>

            <div class="details-section flex flex-col space-y-3 mt-5">
              <h2 class="text-gray-700 text-base font-bold uppercase">
                Synopsis
              </h2>
              <p class="text-gray-600 text-lg font-normal">
                {{ movieDoc.sysnopsis }}
              </p>
              <p class="text-gray-500">
                <strong>Genre:</strong> {{ movieDoc.genre }}
              </p>
              <p class="text-gray-500">
                <strong>Language:</strong> {{ movieDoc.language }}
              </p>
              <p class="text-gray-500">
                <strong>Duration:</strong> {{ movieDoc.duration }}
              </p>
            </div>

            <div class="w-full flex items-center justify-center mt-7">
              <Button size="xl" variant="solid" @click="currentStep++"
                >Book Ticket</Button
              >
            </div>

            <div class="flex flex-row mt-6 space-x-2">
              <Button
                class="mt-5"
                size="lg"
                variant="subtle"
                v-if="currentStep !== 0 && currentStep !== 4"
                @click="currentStep--"
                >Go Back</Button
              >

              <Button
                class="mt-5"
                size="lg"
                variant="solid"
                v-if="currentStep !== 0 && currentStep !== 4"
                :disabled="!nextButtonEnabled"
                @click="handleNextClick()"
                >Next</Button
              >
            </div>
          </div>
        </div>
      </div>

      <!-- page two -->

      <div v-else-if="currentStep === 1" class="seat-selection">
    
        <h2 class="font-medium text-2xl mt-7 text-gray-900 text-center">
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
          <h2 class="font-medium text-2xl text-gray-900 text-center">
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
          <h2 class="font-medium text-2xl text-gray-900 text-center">
            Select Cinema & Show
          </h2>

          <div class="theater-options space-y-6 w-full">
            <div
              v-for="theatre in Object.keys(theaterShows.data)"
              :key="theatre"
              class="theater-card bg-white shadow-lg p-5 rounded-lg text-center"
            >
              <h3 class="text-lg font-bold text-gray-800">{{ theatre }}</h3>

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
        <h2 class="font-medium text-2xl mt-7 text-gray-900 text-center">
          Select Seats
        </h2>

        <div class="seat-structure mt-6 p-5 rounded-lg shadow-lg bg-white">
          <div
            v-for="row in Object.keys(seatStructure)"
            :key="row"
            class="seat-row flex justify-center space-x-4 mb-4"
          >
            <span
              v-for="seat in seatStructure[row]"
              :key="seat[0]"
              @click="selectSeat(row, seat[0])"
              class="seat w-8 h-8 rounded-lg border border-gray-300 transition-all duration-200"
              :class="[
                seat[1] === 'Available'
                  ? 'bg-blue-200 hover:bg-blue-300'
                  : seat[1] === 'Selected'
                  ? 'bg-blue-600 text-white border-blue-800'
                  : 'bg-gray-300 border-gray-400',
                hasSelectedCorrectNumberOfSeats
                  ? 'cursor-not-allowed'
                  : 'cursor-pointer',
              ]"
            ></span>
          </div>
        </div>
      </div>

      <!-- page five -->

      <div v-else-if="currentStep === 4">
        <div class="w-full flex items-center flex-col mt-7">
          <h1 class="text-[120px]">🍿</h1>
          <h2 class="font-medium text-xl mt-7 text-gray-900">
            Enjoy the movie!
          </h2>
        </div>
      </div>
    </div>

    <div class="flex flex-row mt-6 space-x-2 justify-center">
      <Button
        class="mt-5"
        size="lg"
        variant="subtle"
        v-if="currentStep !== 0 && currentStep !== 4"
        @click="currentStep--"
      >
        Go Back
      </Button>

      <Button
        class="mt-5"
        size="lg"
        variant="solid"
        v-if="currentStep !== 0 && currentStep !== 4"
        :disabled="!nextButtonEnabled"
        @click="handleNextClick()"
      >
        Next
      </Button>
    </div>
  </div>
</template>




<script setup>
import { ref, reactive, computed } from 'vue'
import { createDocumentResource, createListResource } from 'frappe-ui'

const props = defineProps({
  movieName: {
    type: String,
    required: true,
  },
})

const movieResource = createDocumentResource({
  doctype: 'Movie',
  name: props.movieName,
  onSuccess(doc) {
    console.log(doc)
  },
  auto: true,
})

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

const movieBooking = createListResource({
  doctype: 'Ticket Booking',
  insert: {
    onSuccess() {
      console.log('Booking Created!')
      currentStep.value++
    },
  },
})

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

// const seatStructure = {
//     A : [
//         [1, 'Booked'],
//         [2, 'Availabel'],
//         [3, 'Availabel'],
//         [4, 'Availabel'],
//         [5, 'Availabel'],
//         [6, 'Availabel'],
//         [7, 'Availabel']
//     ],
//     B : [
//         [1, 'Booked'],
//         [2, 'Availabel'],
//         [3, 'Availabel'],
//         [4, 'Availabel'],
//         [5, 'Availabel'],
//         [6, 'Availabel'],
//         [7, 'Availabel']
//     ],
//     c : [
//         [1, 'Booked'],
//         [2, 'Availabel'],
//         [3, 'Availabel'],
//         [4, 'Availabel'],
//         [5, 'Availabel'],
//         [6, 'Availabel'],
//         [7, 'Availabel']
//     ],
//     D : [
//         [1, 'Booked'],
//         [2, 'Availabel'],
//         [3, 'Availabel'],
//         [4, 'Availabel'],
//         [5, 'Availabel'],
//         [6, 'Availabel'],
//         [7, 'Availabel']
//     ],
//     E : [
//         [1, 'Booked'],
//         [2, 'Availabel'],
//         [3, 'Availabel'],
//         [4, 'Availabel'],
//         [5, 'Availabel'],
//         [6, 'Availabel'],
//         [7, 'Availabel']
//     ],
// }

const today = new Date().toISOString().substr(0, 10)
const currentStep = ref(0)
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
  if (currentStep.value != 3) {
    currentStep.value++
    return
  }

  // create booking
  movieBooking.insert.submit({
    movie: props.movieName,
    date: bookingData.date,
    show: bookingData.show,
    selected_seats: JSON.stringify(bookingData.selectedSeats),
    number_of_tickets: bookingData.numberOfSeats,
  })
}
</script>



