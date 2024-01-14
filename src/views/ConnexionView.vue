<template>
  <main>
    <div class="grid grid-cols-2 -mt-16">
      <div class="flex flex-col justify-center bg-signup-bg bg-cover">
        <h2 class="text-3xl font-bold text-center mt-4 bg-blue-950 text-white py-2">Inscription</h2>
        <form @submit.prevent="inscription" method="post" class="flex flex-col gap-4 mt-8 items-center">
          <input
            class="border-2 border-blue-950 w-48 rounded-lg py-1 px-2"
            v-model="inscriptionData.username"
            type="text"
            name="username"
            id="inscription-username"
            placeholder="Username"
            required
          />
          <input
            class="border-2 border-blue-950 w-48 rounded-lg py-1 px-2"
            v-model="inscriptionData.password"
            type="password"
            name="mdp"
            id="inscription-mdp"
            placeholder="Mot de Passe"
            required
          />
          <input
            class="border-2 border-blue-950 bg-blue-950 text-white font-semibold w-48 rounded-lg py-2 hover:scale-110 transition ease-in"
            type="submit" 
            value="Inscription" />
        </form>
      </div>

      <div class="flex flex-col justify-center bg-login-bg bg-cover text-white h-screen">
        <h2 class="text-3xl font-bold text-center mt-4 bg-white text-black py-2">Connexion</h2>
        <form @submit.prevent="connexion" method="post" class="flex flex-col gap-4 mt-8 items-center">
          <input
            class="border-2 border-white w-48 rounded-lg py-1 px-2"
            v-model="loginData.username"
            type="text"
            name="username"
            id="login-username"
            required
            placeholder="Username"
          />
          <input
            class="border-2 border-white w-48 rounded-lg py-1 px-2"
            v-model="loginData.password"
            type="password"
            name="mdp"
            id="login-mdp"
            required
            placeholder="Mot de Passe"
          />
          <input 
            class="border-2 border-white bg-white text-black font-semibold w-48 rounded-lg py-2 hover:scale-110 transition ease-in"
            type="submit" 
            value="Connexion" />
        </form>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";
import { useGlobalStore } from "/store/global.js";

const globalStore = useGlobalStore();

const setToken = (token) => {
  globalStore.setToken(token);
};

const inscriptionData = ref({
  username: "",
  password: "",
});

const loginData = ref({
  username: "",
  password: "",
});

const connexion = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5173/connexion",
      loginData.value
    );
    globalStore.setToken(response.data.userId);

    console.log(response.data.userId);
    
    loginData.value.username = "";
    loginData.value.password = "";
  } catch (error) {
    console.error("Error during login:", error);
  }
};

const inscription = async () => {
  try {
    const response = await axios.post(
      "http://localhost:5173/inscription",
      inscriptionData.value
    );

    console.log(response.data);
    
    inscriptionData.value.username = "";
    inscriptionData.value.password = "";
  } catch (error) {
    console.error("Error during inscription:", error.message);
  }
};
</script>