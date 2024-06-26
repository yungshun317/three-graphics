import * as THREE from '../three.module.min.js';
import { OrbitControls } from "../OrbitControls.js";
import { OBJLoader } from "../OBJLoader.js";
import { GLTFLoader } from "../GLTFLoader.js";
import { DRACOLoader } from "../DRACOLoader.js";
import { FBXLoader } from "../FBXLoader.js";

// [1] Scene
const scene = new THREE.Scene();

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
const directionalLight = new THREE.DirectionalLight(0xffffff, 2.8);
directionalLight.position.z = 2;
scene.add(ambientLight, directionalLight);

// Responsive
window.addEventListener("resize", () => {
    // New size
    aspect.width = window.innerWidth;
    aspect.height = window.innerHeight;

    // New aspect ratio
    camera.aspect = aspect.width / aspect.height;
    camera.updateProjectionMatrix();

    // New render size
    renderer.setSize(aspect.width, aspect.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// [2] Object
// OBJLoader
/*
const objLoader = new OBJLoader();
objLoader.load("models/suzan.obj", (object) => {
    console.log(object);
    object.position.y = 0;
    object.children[0].position.z = -3;
    object.children[0].material = new THREE.MeshNormalMaterial();
    console.log(object);
    scene.add(object);
})
*/

// GLTFLoader
const gltfLoader = new GLTFLoader();
/*
gltfLoader.load("models/monkeyglb.glb", (glb) => {
    scene.add(glb.scene);
    console.log(glb.scene);
});
*/

// Load GLTF Model using `DRACOLoader`
/*
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("/models/draco/");
gltfLoader.setDRACOLoader(dracoLoader);
console.log(dracoLoader);
gltfLoader.load("models/2.gltf", (gltf) => {
   scene.add(gltf.scene);
   console.log(gltf.scene);
});
*/

// `AnimationMixer`
/*
let animationMixer = null;
gltfLoader.load("models/newModel.glb", (glb) => {
    animationMixer = new THREE.AnimationMixer(glb.scene);
    const clipAction = animationMixer.clipAction(glb.animations[3]);
    clipAction.play();
    glb.scene.position.y = -0.8;
    scene.add(glb.scene);
    // glb.scene.scale.set(0.5, 0.5, 0.5);
    console.log(glb);
});
*/

// FBXLoader
const fbxLoader = new FBXLoader();
let animationMixer = null;
fbxLoader.load("../static/models/Taunt.fbx", (fbx) => {
    animationMixer = new THREE.AnimationMixer(fbx);
    const clipAction = animationMixer.clipAction(fbx.animations[0]);
    clipAction.play();
    fbx.scale.set(0.01, 0.01, 0.01);
    fbx.position.y = -0.8;
    scene.add(fbx);
    console.log(fbx)
});

// [3] Camera
const aspect = {
    width: window.innerWidth,
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, aspect.width / aspect.height);
camera.position.z = 2;
scene.add(camera);

// [4] Renderer
// Select the `Canvas` element
const canvas = document.querySelector(".draw");
// Add the `WebGLRenderer`
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// Renderer size
renderer.setSize(aspect.width, aspect.height);

// `OrbitControls`
const orbitControls = new OrbitControls(camera, canvas);
orbitControls.enableDamping = true;

// `Clock` class
const clock = new THREE.Clock();
let previousTime = 0;

// Animate
const animate = () => {
    // `getElapsedTime`
    const elapsedTime = clock.getElapsedTime();
    const frameTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update `animationMixer`
    if (animationMixer) {
        animationMixer.update(frameTime);
    }

    // Update `OrbitControls`
    orbitControls.update();

    // Renderer
    // Draw what the camera inside the scene captured
    renderer.render(scene, camera);

    // `requestAnimationFrame`
    window.requestAnimationFrame(animate);
};
animate();