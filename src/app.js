import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
// import {FlyControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/FlyControls.js';
import {create_neutron_wall} from "./neutron_wall.js";
import {create_veto_wall} from "./veto_wall.js";
import {create_microball} from "./microball.js";
import { VRButton } from '../VRButton.js';

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

const scene = new THREE.Scene();
// scene.background = new THREE.Color( 0xffffff );
const directionalLight = new THREE.DirectionalLight( 0xffffff, .5);
scene.add( directionalLight );
directionalLight.position.y = 300;

const light = new THREE.AmbientLight( 0xffffff );
scene.add( light );

// scene.fog = new THREE.Fog(0x000000, 200, 1000);
scene.fog = new THREE.FogExp2(0x000000, .001);

const controls = new OrbitControls(camera, renderer.domElement);
// const controls = new FlyControls(camera, renderer.domElement); //flycontrols
// controls.dragToLook = true; //flycontrols

camera.position.set(200, 200, 200);
camera.lookAt(0, 0, 0);
controls.update();

// const cameraGroup = new THREE.Group();
// cameraGroup.position.set(200,0,0);  // Set the initial VR Headset Position.

// const v_wall_z_dist = 1.0008;
// const dist_bw_neutron_veto = 61.085; //DOUBLE CHECK DIST BW N WALL AND V WALL. IS N WALL TILTED?

const neutron_wall = new THREE.Group();
create_neutron_wall(scene, neutron_wall, 24, 193.675, 8.255, 6.985, .3175);
// neutron_wall.rotateY(3.14/4);

const veto_wall = new THREE.Group();
create_veto_wall(scene, veto_wall, 23, 9.398, 227.2362, 1.0008, .3, .15);

// const axesHelper = new THREE.AxesHelper( 600 );
// scene.add( axesHelper );

const microball = new THREE.Group();
create_microball(scene, microball); //The first entry in the nested list for traps_to_remove is the ring, the rest are the crystals to remove within the ring. The order of the traps within a ring must be listed in increasing order (maybe later can sort before removing)

neutron_wall.position.z -= 200;
veto_wall.position.z -= 300;

const size = 600;
const divisions = 50;
const gridHelper = new THREE.GridHelper( size, divisions );
scene.add( gridHelper );




function animate() {
    renderer.setAnimationLoop(animate);
    // controls.update(.05); //flycontrols
    renderer.render(scene, camera);
};

animate();


