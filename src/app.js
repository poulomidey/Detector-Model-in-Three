import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);

const board = new THREE.Group();

for (let i = 0; i < 24; i++) {
    const geometry = new THREE.BoxGeometry(193.675, 8.255, 6.985);
    let materialProperties;
    if (i % 2 == 0) {
        materialProperties = {
            color: "hsl(228, 100%, 78%)",
        };
    } else {
        materialProperties = {
            color: "hsl(228, 100%, 50%)",
        };
    }
    let material = new THREE.MeshBasicMaterial(materialProperties);
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    cube.position.y = i * 8.255;
    board.add(cube);
}

scene.add(board);

camera.position.set(200,200,200);
camera.lookAt(0,0,0);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();