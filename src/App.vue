<script setup>
import { RouterView } from "vue-router";
import { useGlobalStore } from "../store/global.js";
import HeaderVue from "@/components/Header.vue"
import { onMounted } from "vue";

const globalStore = useGlobalStore();

onMounted(() => {
  const token = localStorage.getItem("token");
  globalStore.setToken(JSON.parse(token));
});
</script>

<template>
  <header>
    <HeaderVue />
  </header>
  <RouterView />
</template>