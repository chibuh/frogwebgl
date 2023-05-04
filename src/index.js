import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

var initialPos=[0,0,0,0,0,0,0];
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
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 5, 0);
scene.add(pointLight);


const pointLight1 = new THREE.DirectionalLight(0xff0000, 1);
pointLight1.position.set(5, 5, 0);
pointLight1.castShadow = true;
pointLight1.shadow.radius = 2;

scene.add(pointLight1);

// GLTF-LOADER
// const loader = new GLTFLoader();
const parcelPath = new URL("./model/frogNew.glb", import.meta.url);
var mixer1, isPlaying1 = false, animationsArray1, glb1;

const parcelPath2 = new URL("./model/frogSwim.glb", import.meta.url);
var mixer2, isPlaying2 = false, animationsArray2, glb2;

new GLTFLoader().load(
  parcelPath.href,
  function (glb) {
    glb1 = glb;
    glb1.scene.scale.set(0.1, 0.1, 0.1);
    glb1.scene.position.set(0, 0.2, 0);
    scene.add(glb1.scene);


    glb1.scene.children.forEach((child, ndx) => {
      initialPos[ndx] = child;
    });

    animationsArray1 = glb1.animations;
    mixer1 = new THREE.AnimationMixer( glb1.scene );
    console.log(mixer1)
    mixer1.clampWhenFinished = true;
    mixer1.enable = true;

    mixer1.addEventListener( 'loop', function( e ) { 
      isPlaying1 = false;
      console.log("Animation Loop Ended!");
      mixer1.stopAllAction();
    } );

    new GLTFLoader().load(
      parcelPath2.href,
      function (glb) {
        console.log(glb);
        glb2=glb;
        glb2.scene.scale.set(0.1, 0.1, 0.1);
        glb2.scene.position.set(0, 0.3, 0);

        console.log(dumpObject(glb.scene).join('\n'));
        console.log(glb);


        animationsArray2 = glb2.animations;
        mixer2 = new THREE.AnimationMixer( glb2.scene );
        console.log(mixer2)
        mixer2.clampWhenFinished = true;
        mixer2.enable = true;
    
        mixer2.addEventListener( 'loop', function( e ) { 
          isPlaying2 = false;
          console.log("Animation Loop Ended!");
          mixer2.stopAllAction();
          scene.remove(glb2.scene);
          scene.add(glb1.scene);
        } );
    
      },
      undefined,
      function (error) {
        console.error(error);
      }
    );

  },
  undefined,
  function (error) {
    console.error(error);
  }
);

function jumpAnimation() {
  animationsArray1.forEach( ( clip ) => {
    console.log(clip);
    mixer1.clipAction( clip ).play();
  } );
}

function swimAnimation() {
  animationsArray2.forEach( ( clip ) => {
    console.log(clip);
    mixer2.clipAction( clip ).play();
  } );
}

function leftAnimation() {
  glb1.scene.children[0].rotation.y += -0.01*(Math.sin(clock.elapsedTime-timeLeft));
}
function rightAnimation() {
  glb1.scene.children[0].rotation.y += 0.01*(Math.sin(clock.elapsedTime-timeLeft));
}
function upAnimation() {
// t arm
  glb1.scene.children[1].position.z += 0.002*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[1].rotation.x += -0.002*(Math.sin(clock.elapsedTime-timeLeft));
// b arm
  glb1.scene.children[2].position.z += 0.0055*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[2].position.y += 0.005*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[2].rotation.x += -0.005*(Math.sin(clock.elapsedTime-timeLeft));
// hand
  glb1.scene.children[5].position.z += 0.01*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[5].position.y += 0.01*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[5].rotation.x += -0.005*(Math.sin(clock.elapsedTime-timeLeft));

}
function downAnimation() {
  // t arm
  glb1.scene.children[3].rotation.x += 0.001*(Math.sin(clock.elapsedTime-timeLeft));
// leg
  glb1.scene.children[4].position.z += 0.005*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[4].position.y += 0.003*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[4].rotation.x += -0.005*(Math.sin(clock.elapsedTime-timeLeft));
// foot
  glb1.scene.children[6].position.z += 0.01*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[6].position.y += 0.0005*(Math.sin(clock.elapsedTime-timeLeft));
  glb1.scene.children[6].rotation.x += 0.0005*(Math.sin(clock.elapsedTime-timeLeft));

}


var shaderNum = 1;
function changeSkin(node) {
  if (node.isMesh) 
  {
    console.log(node.name);
    var mat = materialArray[shaderNum].clone();
    node.material = mat;
    node.material.color.set(new THREE.Color(0x73838c));

  }

  node.children.forEach((child, ndx) => {
      changeSkin(child);
    });
}

// KEY-PRESS
var isPlayingLeft = false, isPlayingRight = false, isPlayingS = false, isPlayingW = false , timeLeft;

document.addEventListener("keydown", onDocumentKeyDown, false);
function onDocumentKeyDown(event) {
  var key = event.which; 
  if (key == 74  && !isPlaying1 && !isPlaying2) {
    console.log("Jump");
    isPlaying1 = true;
    scene.remove(glb2.scene);
    console.log(scene.children);
    jumpAnimation();
  }
  if (key == 81  && !isPlaying1 && !isPlaying2) {
    console.log("Swim");
    isPlaying2 = true;
    console.log(scene.children);
    scene.remove(glb1.scene);
    scene.add(glb2.scene);
    swimAnimation();
  }
  if(key==49  && !isPlaying1 && !isPlaying2)
  {
    shaderNum = 0
    confirm("MeshBasicMaterial");
    changeSkin(glb1.scene);
    changePlane();
  }
  if(key==50  && !isPlaying1 && !isPlaying2)
  {
    shaderNum = 1
    confirm("MeshPhongMaterial");
    changeSkin(glb1.scene);
    changePlane();
  }
  if(key==51  && !isPlaying1 && !isPlaying2)
  {
    shaderNum = 2
    confirm("MeshLambertMaterial");
    changeSkin(glb1.scene);
    changePlane();
  }
  if(key==65  && !isPlaying1 && !isPlaying2)
  {
    console.log("left");
    timeLeft = clock.elapsedTime;
    isPlayingLeft = !isPlayingLeft;
    if(!isPlayingLeft) glb1.scene.children[0].rotation.y = 0;
  }
  if(key==68  && !isPlaying1 && !isPlaying2)
  {
    console.log("right");
    timeLeft = clock.elapsedTime;
    isPlayingRight = !isPlayingRight;
    if(!isPlayingRight) glb1.scene.children[0].rotation.y = 0;
  }
  if(key==87  && !isPlaying1 && !isPlaying2)
  {
    console.log("W");
    timeLeft = clock.elapsedTime;
    isPlayingW = !isPlayingW;
  }
  if(key==83  && !isPlaying1 && !isPlaying2)
  {
    console.log("S");
    timeLeft = clock.elapsedTime;
    isPlayingS = !isPlayingS;
  }
};

const clock = new THREE.Clock();

// PLANE
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial1 = new THREE.MeshBasicMaterial({
  color: 0x00ffff,
  side: THREE.DoubleSide,
});
const planeMaterial2 = new THREE.MeshPhongMaterial({
  color: 0x049ef4,
  side: THREE.DoubleSide,
  emissive : 0x000000,
  specular : 0x7e5d5d
});
const planeMaterial3 = new THREE.MeshLambertMaterial({
  color: 0x049ef4,
  side: THREE.DoubleSide,
  emissive : 0x000000
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial2);
plane.rotateX(Math.PI / 2);


var materialArray = [planeMaterial1 , planeMaterial2 , planeMaterial3]
var planeMaterialArray = [planeMaterial1 , planeMaterial2 , planeMaterial3]
function changePlane()
{
  plane.material = planeMaterialArray[shaderNum].clone();
}

// MAIN
function main() {
  requestAnimationFrame(main);
  controls.update();

  pointLight1.position.set(5*Math.cos(2*clock.elapsedTime),10,5*Math.sin(2*clock.elapsedTime));

  const delta = clock.getDelta();
  mixer1.update( delta );

  if(isPlaying2)
  {
    mixer2.update( delta );
  }
  else if(isPlayingLeft) {
    leftAnimation();
  }
  else if(isPlayingRight) {
    rightAnimation();
  }
  else if(isPlayingW) {
    upAnimation();
  }
  else if(isPlayingS) {
    downAnimation();
  }
  else 
  {
    glb1.scene.children[0].rotation.x -= 0.0005*(Math.sin(clock.elapsedTime));
  }
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

  
  scene.add(plane);

  renderer.render(scene, camera);
}

// PRINT hierarchical model
function dumpObject(obj, lines = [], isLast = true, prefix = '') {
  const localPrefix = isLast ? '└─' : '├─';
  lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
  const newPrefix = prefix + (isLast ? '  ' : '│ ');
  const lastNdx = obj.children.length - 1;
  obj.castShadow = true
  obj.children.forEach((child, ndx) => {
      const isLast = ndx === lastNdx;
      dumpObject(child, lines, isLast, newPrefix);
  });
  return lines;
}
requestAnimationFrame(main);
