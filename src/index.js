import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// WINDOW SIZES
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// RENDERER
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// SCENE
const scene = new THREE.Scene();

// CAMERA
const fov = 75;
const aspect = 2; // the canvas default
const near = 0.1;
const far = 100;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 2, 2);

// ORBIT_CONTROLS
const controls = new OrbitControls(camera, canvas);
controls.minPolarAngle = 0;
controls.maxPolarAngle = Math.PI / 2.5;
controls.target.set(0, 0, 0);
controls.update();

// LIGHTS
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

const pointLight1 = new THREE.PointLight(0xff0000, 0.2);
pointLight1.position.set(0, 10, 0);
scene.add(pointLight1);

// GLTF-LOADER
const loader = new GLTFLoader();
const parcelPath = new URL("./model/frogFinal.glb", import.meta.url);

loader.load(
  parcelPath.href,
  function (glb) {
    console.log(glb);
    glb.scene.scale.set(0.2, 0.2, 0.2);
    scene.add(glb.scene);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);
// const url = "./model/frogFinal.glb";
// loader.load(url, (gltf) => {
//   scene.add(gltf.scene);
// });

const clock = new THREE.Clock();
// MAIN
function main() {
  requestAnimationFrame(main);
  controls.update();

  // const elapsedTime = clock.getElapsedTime();
  // pointLight1.position.set(3*Math.sin(elapsedTime/20),10,3*Math.sin(elapsedTime/20));

  // CUBE
  // const boxWidth = 1;
  // const boxHeight = 1;
  // const boxDepth = 1;
  // const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
  // const material = new THREE.MeshBasicMaterial({ color: 0x44aa88 }); // greenish blue
  // const cube = new THREE.Mesh(geometry, material);
  // scene.add(cube);

  // PLANE
  const planeGeometry = new THREE.PlaneGeometry(5, 5);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ffff,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.rota
  plane.rotateX(Math.PI / 2);
  scene.add(plane);

  renderer.render(scene, camera);
}

requestAnimationFrame(main);
