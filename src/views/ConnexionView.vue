<template>
  <main class="mx-2 my-2">
    <div>
      <h2 class="font-bold">Inscription</h2>

      <form @submit.prevent="inscription" method="post">
        <input
          v-model="inscriptionData.email"
          type="text"
          name="email"
          id="inscription-email"
          required
          placeholder="Email"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        />
        <input
          v-model="inscriptionData.password"
          type="password"
          name="mdp"
          id="inscription-mdp"
          required
          placeholder="Mot de Passe"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        />

        <input
          type="submit"
          value="S'Inscrire"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        />
      </form>
    </div>

    <div>
      <h2 class="font-bold">Connexion</h2>

      <form @submit.prevent="connexion" method="post">
        <input
          v-model="loginData.email"
          type="text"
          name="email"
          id="login-email"
          required
          placeholder="Email"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        />
        <input
          v-model="loginData.password"
          type="password"
          name="mdp"
          id="login-mdp"
          required
          placeholder="Mot de Passe"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        />

        <input
          type="submit"
          value="Se Connecter"
          class="border-black border-2 px-2 py-1 mx-2 my-1 rounded-lg"
        />
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const inscriptionData = ref({
  email: "",
  password: "",
});

const loginData = ref({
  email: "",
  password: "",
});

const connexion = async () => {
  try {
    const secretKey = "g23jh2g4kjn1k5v2&!hskjf5n1";
    const response = await axios.post(
      "http://localhost:3000/connexion",
      loginData.value
    );
    console.log(response.data); 
    
    loginData.value.email = "";
    loginData.value.password = "";
  } catch (error) {
    console.error("Error during login:", error);
  }
};

const inscription = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/inscription",
      inscriptionData.value
    );
    console.log(response.data);

    inscriptionData.value.email = "";
    inscriptionData.value.password = "";
  } catch (error) {
    console.error("Error during inscription:", error.message);
  }
};
</script>