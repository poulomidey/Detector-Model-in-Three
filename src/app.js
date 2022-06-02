import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
import {create_neutron_wall} from "./neutron_wall.js";
import {create_veto_wall} from "./veto_wall.js";
import {create_microball} from "./microball.js";

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xffffff );

const controls = new OrbitControls(camera, renderer.domElement);



// const v_wall_z_dist = 1.0008;
// const dist_bw_neutron_veto = 61.085; //DOUBLE CHECK DIST BW N WALL AND V WALL. IS N WALL TILTED?

const neutron_wall = new THREE.Group();
create_neutron_wall(scene, neutron_wall, 24, 193.675, 8.255, 6.985, .3175);
// neutron_wall.rotateY(3.14/4);

//veto wall
const veto_wall = new THREE.Group();
create_veto_wall(scene, veto_wall, 23, 9.398, 227.2362, 1.0008, .3, .15);

// const axesHelper = new THREE.AxesHelper( 600 );
// scene.add( axesHelper );

create_microball(scene); //make microball group in future and add rings to microball

neutron_wall.position.z -= 200;
veto_wall.position.z -= 300;




const size = 600;
const divisions = 50;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );

camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);
controls.update();

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
};

animate();


