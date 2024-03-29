<script setup>
    import * as THREE from "three";
    import { ref, onMounted, onBeforeUnmount } from "vue";
    import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
    import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
    import { TextureLoader } from "three/src/loaders/TextureLoader.js";

    const canvas = ref(null);
    let controls = null;
    let clock = new THREE.Clock();
    let scene = null;
    let camera = null;
    let renderer = null;
    let animationId = null;
    let aiguilleHeures,
    aiguilleMinutes,
    aiguilleSecondes,
    boitierRond,
    boitierCarre,
    iPierre,
    iBracelet,
    iFermoir,
    iBouton;

    let currentTexture = "texture-cuir-blanc.jpg";
    let currentTextureBoitierRond = "background_black01.png";
    let currentTextureBoitierCarre = "background_black01.png";

    const textureLoader = new TextureLoader();
    const texture = textureLoader.load(`/images/${currentTexture}`);

    const initScene = () => {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
        renderer.setSize(900, 550);
        renderer.setClearColor(0x222222, 1);
        controls = new OrbitControls(camera, renderer.domElement);

        var loader = new ColladaLoader();
        loader.load("/models/montre.dae", onLoaded, onProgress, onError);
    };

    const updateClockHands = () => {
        const now = new Date();
        const hours = now.getHours() % 12;
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        const hoursRotation = (hours + minutes / 60) * (Math.PI / 6);
        const minutesRotation = (minutes + seconds / 60) * (Math.PI / 30);
        const secondsRotation = seconds * (Math.PI / 30);
        
        if (aiguilleHeures) aiguilleHeures.rotation.z = -hoursRotation;
        if (aiguilleMinutes) aiguilleMinutes.rotation.z = -minutesRotation;
        if (aiguilleSecondes) aiguilleSecondes.rotation.z = -secondsRotation;
        };

        const animate = () => {
            let dt = clock.getDelta();
            updateClockHands();
            animationId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        const changePierreColor = (type) => {
          let color;
          switch (type) {
            case "rubis":
              color = 0xff0000;
              break;
            case "émeraude":
              color = 0x00ff00;
              break;
            case "diamant":
              color = 0x0000ff;
              break;
            default:
              color = 0x0000ff;
          }

          if (iPierre) iPierre.material.color.set(color);
        };

        const handleColorChange = (event) => {
            const newColor = event.target.value;
            changeFermoirColor(newColor);
        };
        
        const changeFermoirColor = (color) => {
            const decimalColor = parseInt(color.slice(1), 16);
            if (iFermoir) iFermoir.material.color.set(decimalColor);
        };

        let showBoitier = true;
        const toggleBoitierRond = () => {
            showBoitier = !showBoitier;
            boitierRond.visible = showBoitier;
            boitierCarre.visible = !showBoitier;
        };

        const changeTexture = (texture) => {
            currentTexture = texture;
            const textureLoader = new TextureLoader();
            const newTexture = textureLoader.load(`/images/${texture}`);
            iBracelet.material.map = newTexture;
            iBracelet.material.needsUpdate = true;
        };
        
        const changeTextureBoitierRond = (textureBoitierRond) => {
            currentTextureBoitierRond = textureBoitierRond;
            const textureLoader = new TextureLoader();
            const newTexture = textureLoader.load(`/images/${textureBoitierRond}`);
            boitierRond.material.map = newTexture;
            boitierRond.material.needsUpdate = true;
        };

        const changeTextureBoitierCarre = (textureBoitierCarre) => {
            currentTextureBoitierCarre = textureBoitierCarre;
            const textureLoader = new TextureLoader();
            const newTexture = textureLoader.load(`/images/${textureBoitierCarre}`);
            boitierCarre.material.map = newTexture;
            boitierCarre.material.needsUpdate = true;
        };

        function onLoaded(collada) {
        let objects = collada.scene;

        aiguilleHeures = objects.getObjectByName("aiguille_heures");
        aiguilleHeures.material = new THREE.MeshBasicMaterial({
            color: 0x888888,
        });

        aiguilleMinutes = objects.getObjectByName("aiguille_minutes");
        aiguilleMinutes.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

        aiguilleSecondes = objects.getObjectByName("aiguille_secondes");
        aiguilleSecondes.material = new THREE.MeshBasicMaterial({
            color: 0x00ff00,
        });

        boitierRond = objects.getObjectByName("boitier_rond");
        const textureLoaderBoitierRond = new TextureLoader();
        const textureBoitierRond = textureLoaderBoitierRond.load(
            `/images/${currentTextureBoitierRond}`
        );
        boitierRond.material = new THREE.MeshBasicMaterial({
            map: textureBoitierRond,
        });

        boitierCarre = objects.getObjectByName("boitier_carre");
        const textureLoaderBoitierCarre = new TextureLoader();
        const textureBoitierCarre = textureLoaderBoitierCarre.load(
            `/images/${currentTextureBoitierCarre}`
        );
        boitierCarre.material = new THREE.MeshBasicMaterial({
            map: textureBoitierCarre,
        });
        boitierCarre.visible = false;

        iBouton = objects.getObjectByName("bouton");
        iBouton.material = new THREE.MeshBasicMaterial({
            color: 0xffffff,
        });

        iPierre = objects.getObjectByName("pierre");
        iPierre.material = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
        });
        
        let iPierre2 = iPierre.clone();
        iPierre2.position.y -= 38;
        
        let iPierre3 = iPierre.clone();
        iPierre3.position.x -= 18.5;
        iPierre3.position.y -= 18.75;
        
        let iPierre4 = iPierre.clone();
        iPierre4.position.x += 18.5;
        iPierre4.position.y -= 18.75;

        iBracelet = objects.getObjectByName("bracelet");
        iBracelet.material = new THREE.MeshBasicMaterial({ map: texture });

        iFermoir = objects.getObjectByName("fermoir");
        iFermoir.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
        });

        scene.add(
            aiguilleHeures,
            aiguilleMinutes,
            aiguilleSecondes,
            boitierCarre,
            boitierRond,
            iPierre,
            iPierre2,
            iPierre3,
            iPierre4,
            iBracelet,
            iFermoir,
            iBouton
        );

        controls.target.set(0, 0, 0);
        camera.position.set(0, 0, 100);
        controls.update();
    }

    var onProgress = function (data) {
        if (data.lengthComputable) {
            var percentComplete = (data.loaded / data.total) * 100;
            console.log(Math.round(percentComplete, 2) + "% downloaded");
        }
    };

    var onError = function (data) {
        console.error(data);
    };

    onMounted(() => {
        initScene();
        animate();
    });

    onBeforeUnmount(() => {
        cancelAnimationFrame(animationId);
    });
</script>

<template>
  <div class="flex gap-4">
    <div>
      <canvas ref="canvas" />
    </div>
    <div class="flex flex-col">
      <div class="mt-2">
        <div>
          <h2 class="font-bold">Texture du Bracelet :</h2>
        </div>
        <div>
          <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTexture('texture-cuir-blanc.jpg')"
          >
            Cuir Blanc
          </button>
          <button
            class="border-blue-950 border-2 px-2 py-1 mx-2 my-1 rounded-md"
            @click="changeTexture('texture-tissus-or.jpg')"
          >
            Tissu Or
          </button>
          <button
            class="border-blue-950 border-2 px-2 py-1 mx-2 my-1 rounded-md"
            @click="changeTexture('texture-tissus-marron.jpg')"
          >
            Tissu Marron
          </button>
        </div>
      </div>
      <div class="mt-2">
        <div>
          <h2 class="font-bold">Choix du boitier :</h2>
        </div>
        <div class="flex gap-2">
          <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="toggleBoitierRond"
          >
            Boitier Rond / Carré
          </button>
        </div>
      </div>
      <div class="mt-2">
        <div>
          <h2 class="font-bold">Texture du Boitier Rond</h2>
        </div>
        <div class="gap-2">
          <div class="flex gap-4">
            <button
              class="border-blue-950 border-2 px-4 py-2 my-1 rounded-md"
              @click="changeTextureBoitierRond('background_black01.png')"
            >
              Black 01
            </button>
            <button
              class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
              @click="changeTextureBoitierRond('background_black02.png')"
            >
              Black 02
            </button>
            <button
              class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
              @click="changeTextureBoitierRond('background_fluo01.png')"
            >
              Fluo
            </button>
            <button
              class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
              @click="changeTextureBoitierRond('background_mickey.png')"
            >
              Mickey
            </button>
          </div>

          <div class="flex gap-4">
            <button
              class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
              @click="changeTextureBoitierRond('background_white01.png')"
            >
                White 01
              </button>
              <button
                class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
                @click="changeTextureBoitierRond('background_white02.png')"
              >
                White 02
              </button>
              <button
                class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
                @click="changeTextureBoitierRond('background_white03.png')"
              >
                White 03
              </button>
              <button
                class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
                @click="changeTextureBoitierRond('background_white04.png')"
              >
                White 04
              </button>
              <button
                class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
                @click="changeTextureBoitierRond('background_white05.png')"
              >
                White 05
              </button>
            </div>
        </div>
      </div>
      <div class="mt-2">
        <div>
            <h2 class="font-bold w-64">Texture du Boitier Carre</h2>
        </div>
        <div class="">
          <div class="flex gap-4">
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_black01.png')"
            >
            Black 01
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_black02.png')"
            >
            Black 02
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_fluo01.png')"
            >
            Fluo
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_mickey.png')"
            >
            Mickey
            </button>
          </div>
          <div class="flex gap-4">
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_white01.png')"
            >
            White 01
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_white02.png')"
            >
            White 02
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_white03.png')"
            >
            White 03
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_white04.png')"
            >
            White 04
            </button>
            <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changeTextureBoitierCarre('background_white05.png')"
            >
            White 05
            </button>
          </div>
        </div>
      </div>
      <div class="mt-2">
        <div class="mb-1">
          <h2 class="font-bold">Couleur du Fermoir</h2>
        </div>
        <input type="color" @input="handleColorChange" />
      </div>
      <div class="mt-2">
        <div>
          <h2 class="font-bold">Type de Pierre Précieuse</h2>
        </div>
        <div class="flex gap-2">
          <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changePierreColor('rubis')"
          >
            Rubis
          </button>
          <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changePierreColor('émeraude')"
          >
            Émeraude
          </button>
          <button
            class="border-blue-950 border-2 px-2 py-1 my-1 rounded-md"
            @click="changePierreColor('diamant')"
          >
            Diamant
          </button>
        </div>
      </div>
    </div>
  </div>
</template>