<template>
  <main>
    <h1>Page Login</h1>

    <div>
      <h2>Inscription</h2>

      <form @submit.prevent="inscription" method="post">
        <input
          v-model="inscriptionData.username"
          type="text"
          name="username"
          id="inscription-username"
          required
          placeholder="Username"
        />
        <input
          v-model="inscriptionData.password"
          type="password"
          name="mdp"
          id="inscription-mdp"
          required
          placeholder="Mot de Passe"
        />

        <input type="submit" value="Inscription" />
      </form>
    </div>

    <div>
      <h2>Connexion</h2>

      <form @submit.prevent="connexion" method="post">
        <input
          v-model="loginData.username"
          type="text"
          name="username"
          id="login-username"
          required
          placeholder="Username"
        />
        <input
          v-model="loginData.password"
          type="password"
          name="mdp"
          id="login-mdp"
          required
          placeholder="Mot de Passe"
        />

        <input type="submit" value="Connexion" />
      </form>
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