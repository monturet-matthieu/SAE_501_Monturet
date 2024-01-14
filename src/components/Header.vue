<script setup>

</script>

<template>
  <nav class="bg-blue-950 flex justify-center h-16">
    <div
      class="flex gap-16 items-center text-2xl text-white font-bold "
    >
      <div class="hover:underline underline-offset-8 decoration-blue-400">
        <router-link to="/">
          <p class="">Accueil</p>
        </router-link>
      </div>
      <div class="hover:underline underline-offset-8 decoration-blue-400">
        <router-link to="/montrelist">
          <p>Montres</p>
        </router-link>
      </div>
      <div class="hover:underline underline-offset-8 decoration-blue-400">
        <router-link to="/panier/:id">
          <p>Panier</p>
        </router-link>
      </div>
      <div
        class="mr-[45px] hover:underline underline-offset-8 decoration-blue-400"
      >
        <router-link to="/connexion">
          <p>S'inscrire / Se connecter</p>
        </router-link>
      </div>
    </div>
  </nav>
</template>