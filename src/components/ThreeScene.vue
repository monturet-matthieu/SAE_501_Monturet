<script setup>
  import * as THREE from "three";
  import { ref, onMounted, onBeforeUnmount } from "vue";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader.js";
  import { TextureLoader } from "three/src/loaders/TextureLoader.js";
  const canvas = ref(null);
  
  let controls = null;
  let clock = new THREE.Clock();
  let aiguilleHeures,
  aiguilleMinutes,
  aiguilleSecondes,
  boitierRond,
  boitierCarre,
  iPierre,
  iBracelet,
  iFermoir;
  const initScene = () => {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    renderer = new THREE.WebGLRenderer({ canvas: canvas.value });
    renderer.setSize(1300, 700);
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

  function onLoaded(collada) {
    let objects = collada.scene;
    aiguilleHeures = objects.getObjectByName("aiguille_heures");
    aiguilleHeures.material = new THREE.MeshBasicMaterial({
        color: 0xf0f0f0,
    });
    aiguilleMinutes = objects.getObjectByName("aiguille_minutes");
    aiguilleMinutes.material = new THREE.MeshBasicMaterial({
        color: 0x0f0f0f,
    });
    aiguilleSecondes = objects.getObjectByName("aiguille_secondes");
    aiguilleSecondes.material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });
    const boitierRond = objects.getObjectByName("boitier_rond");
    boitierRond.material = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    const boitierCarre = objects.getObjectByName("boitier_carre");
    boitierCarre.material = new THREE.MeshBasicMaterial({ color: 0x00ffff });

    const iBouton = objects.getObjectByName("bouton");
    iBouton.material = new THREE.MeshBasicMaterial({
        color: 0x00ff00,
    });

    const iPierre = objects.getObjectByName("pierre");
    iPierre.material = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
    });

    const iBracelet = objects.getObjectByName("bracelet");
    iBracelet.material = new THREE.MeshBasicMaterial({ map: texture });

    const iFermoir = objects.getObjectByName("fermoir");
    iFermoir.material = new THREE.MeshBasicMaterial({
        color: 0xf000ff,
    });

    const textureLoader = new TextureLoader();
    const texture = textureLoader.load("public/images/texture-cuir-blanc.jpg");

    scene.add(
        aiguilleHeures,
        aiguilleMinutes,
        aiguilleSecondes,
        boitierCarre,
        boitierRond,
        iPierre,
        iBracelet,
        iFermoir
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
    <div>
      <canvas ref="canvas" />
    </div>
</template>