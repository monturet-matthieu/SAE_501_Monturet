<template>
  <div>
    <h1 class="m-5">Liste des montres</h1>
    <ul class="m-5">
      <li
        class="border my-2 p-3"
        v-for="watch in watches"
        :key="watch.montreID"
      >
        {{ watch.montreID }} | {{ watch.boitier_nom }} /
        {{ watch.boitier_texture }} | {{ watch.pierre_nom }} |
        {{ watch.bracelet_texture }} |
        {{ watch.pierre_prix + watch.boitier_prix + watch.bracelet_prix }}
        <RouterLink
          :to="`/montrelist/${watch.montreID}`"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
          >Voir la montre</RouterLink
        >
        <button
          @click="deleteWatch(watch.montreID)"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        >
          Supprimer la montre
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      watches: [],
    };
  },
  mounted() {
    this.fetchWatches();
  },
  methods: {
    fetchWatches() {
      axios
        .get("http://localhost:5173/montres")
        .then((response) => {
          this.watches = response.data;
        })
        .catch((error) => {
          console.error("Error fetching watches:", error.message);
        });
    },
    deleteWatch(montreID) {
      axios
        .delete(`http://localhost:5173/montres/${montreID}`)
        .then(() => {
          this.watches = this.watches.filter(
            (watch) => watch.montreID !== montreID
          );
        })
        .catch((error) => {
          console.error("Error deleting watch:", error.message);
        });
    },
  },
};
</script>