<template>
    <div class="mx-4 my-4">
      <h1 class="text-3xl">Personnalisez votre montre</h1>
  
      <form @submit.prevent="addWatch">
        <label for="BoitierID">Boitier :</label>
        <select
          v-model="newBoitierID"
          required
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        >
          <option
            v-for="boitier in boitiers"
            :key="boitier.boitierID"
            :value="boitier.boitierID"
          >
            {{ boitier.texture }}
          </option>
        </select>
  
        <br />

        <label for="PierreID">Pierre :</label>
        <select
          v-model="newPierreID"
          required
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        >
          <option
            v-for="pierre in pierres"
            :key="pierre.pierreID"
            :value="pierre.pierreID"
          >
            {{ pierre.nom }}
          </option>
        </select>
  
        <br />
  
        <label for="BraceletID">Bracelet :</label>
        <select
          v-model="newBraceletID"
          required
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        >
          <option
            v-for="bracelet in bracelets"
            :key="bracelet.braceletID"
            :value="bracelet.braceletID"
          >
            {{ bracelet.texture }}
          </option>
        </select>
  
        <br />
  
        <button
          type="submit"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        >
          Valider la création
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  export default {
    data() {
      return {
        newBoitierID: null,
        newPierreID: null,
        newBraceletID: null,
        boitiers: [],
        pierres: [],
        bracelets: [],
      };
    },
    mounted() {
      axios
        .get("http://localhost:5173/boitier")
        .then((response) => {
          this.boitiers = response.data;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des boîtiers", error);
        });
        
      axios
        .get("http://localhost:5173/pierre")
        .then((response) => {
          this.pierres = response.data;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des pierres", error);
        });

      axios
        .get("http://localhost:5173/bracelet")
        .then((response) => {
          this.bracelets = response.data;
        })
        .catch((error) => {
          console.error("Erreur lors de la récupération des bracelets", error);
        });
    },
    methods: {
      addWatch() {
        axios
          .post("http://localhost:5173/montre/creation", {
            BoitierID: this.newBoitierID,
            PierreID: this.newPierreID,
            BraceletID: this.newBraceletID,
          })
          .then((response) => {
            console.log(response.data.message);
            this.$router.push("/montrelist");
          })
          .catch((error) => {
            console.error(
              "Erreur lors de l'ajout de la montre",
              error.response.data.error
            );
          });
      },
    },
  };
  </script>