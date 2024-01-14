<script setup>
import ThreeSceneVue from "@/components/ThreeScene.vue";
import MontreVue from "@/components/Montre.vue";
</script>

<template>
  <div>
    <div class="my-2 mx-2">
      <ThreeSceneVue></ThreeSceneVue>
    </div>
    <div>
      <MontreVue></MontreVue>
    </div>
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
    axios
      .get("http://localhost:5173/montres")
      .then((response) => {
        this.watches = response.data;
      })
      .catch((error) => {
        console.error("Error fetching watches:", error.message);
      });
  },
};
</script>