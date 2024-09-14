import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Debug
 */

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

//texture
const textureLoader = new THREE.TextureLoader();

//material

let mjlogo;

//models
const gltfLoader = new GLTFLoader();
gltfLoader.load(
  "/wp-content/themes/2024-theme/assets/models/mjt-logo.glb",
  (gltf) => {
    mjlogo = gltf.scene;
    scene.add(mjlogo);
  },
);

/**
 * Particles
 */
//Geometry
const planeGeometry = new THREE.PlaneGeometry(20, 20, 150, 150);
const planeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uElevation: { value: 0.282 },
  },
  vertexShader: `
        uniform float uTime;
        uniform float uElevation;

        attribute float aSize;

        varying float vPositionY;
        varying float vPositionZ;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 0.25);
            modelPosition.y = sin(modelPosition.x - uTime) * sin(modelPosition.z * 0.6 + uTime) * uElevation;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;

            gl_PointSize = 2.0 * aSize;
            gl_PointSize *= ( 1.0 / - viewPosition.z );

            vPositionY = modelPosition.y;
            vPositionZ = modelPosition.z;
        }
    `,
  fragmentShader: `
        varying float vPositionY;
        varying float vPositionZ;

        void main() {
            float strength = (vPositionY + 0.25) * 0.3;
            gl_FragColor = vec4(1.0, 1.0, 1.0, strength);
        }
    `,
  transparent: true,
});

const planeSizesArray = new Float32Array(
  planeGeometry.attributes.position.count,
);
for (let i = 0; i < planeSizesArray.length; i++) {
  planeSizesArray[i] = Math.random() * 4.0;
}
planeGeometry.setAttribute(
  "aSize",
  new THREE.BufferAttribute(planeSizesArray, 1),
);

const plane = new THREE.Points(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI * 0.4;
scene.add(plane);

//material

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight("#fff", 3);
directionalLight.position.set(1, 1, 0);
directionalLight.lookAt(0, 0, 0);
scene.add(directionalLight);

/**
 * Sizes
 */
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

/**
 * Camera
 */
//group

const cameraGroup = new THREE.Group();
scene.add(cameraGroup);

// Base camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100,
);
camera.position.z = 6;
camera.position.y = 1;
cameraGroup.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Scroll
 */

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  const newSection = Math.round(scrollY / sizes.height);
});

/**
 * Cursor
 */
const cursor = {};
cursor.x = 0;
cursor.y = 0;

window.addEventListener("mousemove", (event) => {
  cursor.x = event.clientX / sizes.width - 0.5;
  cursor.y = event.clientY / sizes.height - 0.5;
});

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  //animate camera

  camera.position.y = -scrollY / sizes.height;
  const parallaxX = cursor.x;
  const parallaxY = -cursor.y * 0.5;

  cameraGroup.position.x +=
    (parallaxX - cameraGroup.position.x) * 1.2 * deltaTime;
  cameraGroup.position.y +=
    (parallaxY - cameraGroup.position.y) * 1.2 * deltaTime;

  //animate meshes
  if (mjlogo) {
    mjlogo.rotation.y = cursor.x;
  }

  planeMaterial.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
