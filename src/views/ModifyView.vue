<template>
    <div>
      <h1>Edit Watch</h1>
      <form @submit.prevent="updateWatch">
        <label for="boitier">Boitier Texture:</label>
        <select v-model="selectedBoitier" id="boitier">
          <option
            v-for="boitier in boitiers"
            :key="boitier.boitierID"
            :value="boitier.texture"
          >
            {{ boitier.texture }}
          </option>
        </select>
  
        <label for="pierre">Pierre Nom:</label>
        <select v-model="selectedPierre" id="pierre">
          <option
            v-for="pierre in pierres"
            :key="pierre.pierreID"
            :value="pierre.nom"
          >
            {{ pierre.nom }}
          </option>
        </select>
  
        <label for="bracelet">Bracelet Texture:</label>
        <select v-model="selectedBracelet" id="bracelet">
          <option
            v-for="bracelet in bracelets"
            :key="bracelet.braceletID"
            :value="bracelet.texture"
          >
            {{ bracelet.texture }}
          </option>
        </select>
  
        <button type="submit">Update Watch</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    props: ["watchID"],
    data() {
      return {
        selectedBoitier: "",
        selectedPierre: "",
        selectedBracelet: "",
        boitiers: [],
        pierres: [],
        bracelets: [],
      };
    },
    methods: {
      updateWatch() {
        const data = {
          BoitierID: { texture: this.selectedBoitier },
          PierreID: { nom: this.selectedPierre },
          BraceletID: { texture: this.selectedBracelet },
        };
  
        axios
          .put(`http://localhost:3000/montre/personnalisation/${this.watchID}`, data)
          .then((response) => {
            console.log(response.data.message);
          })
          .catch((error) => {
            console.error("Error updating watch:", error);
          });
      },
      fetchBoitiers() {
        axios
          .get("http://localhost:3000/boitier")
          .then((response) => {
            this.boitiers = response.data;
          })
          .catch((error) => {
            console.error("Error fetching Boitier data:", error);
          });
      },
      fetchPierres() {
        axios
          .get("http://localhost:3000/pierre")
          .then((response) => {
            this.pierres = response.data;
          })
          .catch((error) => {
            console.error("Error fetching Pierre data:", error);
          });
      },
      fetchBracelets() {
        axios
          .get("http://localhost:3000/bracelet")
          .then((response) => {
            this.bracelets = response.data;
          })
          .catch((error) => {
            console.error("Error fetching Bracelet data:", error);
          });
      },
    },
    mounted() {
      this.fetchBoitiers();
      this.fetchPierres();
      this.fetchBracelets();
    },
  };
  </script>