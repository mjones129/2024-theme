import * as THREE from "three";

//initialize scene
const scene = new THREE.Scene();

//initialize camera
const camera = new THREE.PerspectiveCamera(
  75, //field of view
  window.innerWidth / window.innerHeight, //aspect ratio
  0.1, //clipping min
  1000, //clipping max
);

//initialize renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geo = new THREE.BoxGeometry(1, 1, 1);
const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geo, mat);
scene.add(cube);

camera.position.z = 5;

function animate() {
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);
