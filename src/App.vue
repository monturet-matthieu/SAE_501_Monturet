<script setup>
import { RouterLink, RouterView } from "vue-router";
import { useGlobalStore } from "../store/global.js";
import { onMounted } from "vue";

const globalStore = useGlobalStore();

onMounted(() => {
  const token = localStorage.getItem("token");
  globalStore.setToken(JSON.parse(token));
});
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />

    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/connexion">Connexion</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>