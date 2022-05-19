import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, renderer.domElement);

const wall = new THREE.Group();

let bar_num = 24;
let x_dist = 193.675;
let y_dist = 8.255;
let z_dist = 6.985;
let spacing = 0.3175;

for (let i = 0; i < bar_num; i++) {
    const geometry = new THREE.BoxGeometry(x_dist, y_dist, z_dist);
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
    const bar = new THREE.Mesh(geometry, material);

    if(i != 0)
    {
        bar.position.y = i * (y_dist + spacing);
    }
    
    wall.add(bar);
}

scene.add(wall);

camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();