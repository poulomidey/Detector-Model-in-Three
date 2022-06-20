import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/OrbitControls.js';
// import {FlyControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/FlyControls.js';
import { VRButton } from '../VRButton.js';
// import { AnimationButton } from './button.js';
import {create_neutron_wall} from "./neutron_wall.js";
import {create_veto_wall} from "./veto_wall.js";
import {create_microball} from "./microball.js";
import {setup} from "./setup.js";
import {rays} from "./ray_animation.js";
import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

document.body.appendChild( VRButton.createButton( renderer ) );
renderer.xr.enabled = true;

// document.body.appendChild( AnimationButton.createButton(renderer));

const controls = new OrbitControls(camera, renderer.domElement);
// const controls = new FlyControls(camera, renderer.domElement); //flycontrols
// controls.dragToLook = true; //flycontrols

const scene = new THREE.Scene();
setup(scene, camera, renderer, controls);



const cameraGroup = new THREE.Group();
cameraGroup.position.set(150,50,-150);  // Set the initial VR Headset Position.
cameraGroup.position.set(-150, 50, -100) //vr for 
renderer.xr.addEventListener('sessionstart', function() {
    scene.add(cameraGroup);
    cameraGroup.add(camera);
});
renderer.xr.addEventListener('sessionend', function() {
    scene.remove(cameraGroup);
    cameraGroup.remove(camera);
    camera.position.set(-200,200,200);
    camera.lookAt(0,0,0);
    controls.update();
});


// const v_wall_z_dist = 1.0008;
// const dist_bw_neutron_veto = 61.085; //DOUBLE CHECK DIST BW N WALL AND V WALL. IS N WALL TILTED?

const neutron_wall = new THREE.Group();
create_neutron_wall(scene, neutron_wall, 24, 193.675, 8.255, 6.985, .3175);

const veto_wall = new THREE.Group();
create_veto_wall(scene, veto_wall, 23, 9.398, 227.2362, 1.0008, .3, .15);

const microball = new THREE.Group();
//[], [[3,3,4,5,6],[4,4,5,6],[5,4,5,6]]: instead of removing the traps, try and make them a lower opacity
create_microball(scene, microball); //The first entry in the nested list for traps_to_remove is the ring, the rest are the crystals to remove within the ring. The order of the traps within a ring must be listed in increasing order (maybe later can sort before removing)

// setup(scene, camera, controls, veto_wall);

const vwboundingBox = new THREE.Box3().setFromObject(veto_wall);
let vwdimensions = new THREE.Vector3();
vwboundingBox.getSize(vwdimensions);

const nboundingBox = new THREE.Box3().setFromObject(neutron_wall);
let ndimensions = new THREE.Vector3();
nboundingBox.getSize(ndimensions);

// const helper = new THREE.Box3Helper( nboundingBox, 0xffff00 );
// scene.add( helper );

const rot = .6871;
const vwdist = 393.3;
const ndist = 441.6;

veto_wall.position.set(vwdist * Math.cos(rot) - .5 * vwdimensions.x * Math.sin(rot), 0, -1 * (vwdist * Math.sin(rot) + .5 * vwdimensions.x * Math.cos(rot)))
veto_wall.rotateY(-1*(Math.PI/2 - rot));

neutron_wall.position.set(ndist * Math.cos(rot) - .5 * ndimensions.x * Math.sin(rot), neutron_wall.position.y, -1 * (ndist * Math.sin(rot) + .5 * ndimensions.x * Math.cos(rot)))
neutron_wall.rotateY(-1*(Math.PI/2 - rot));
// neutron_wall.position.z += 200;
// neutron_wall.position.x += ndist * Math.cos(rot) - .5 * ndimensions.x * Math.sin(rot);
// neutron_wall.position.z += -1 * (ndist * Math.sin(rot) + .5 * ndimensions.x * Math.cos(rot));
// const world = new THREE.Vector3;
// neutron_wall.getWorldPosition(world);
// console.log(world);

// neutron_wall.updateMatrixWorld();
// console.log(neutron_wall.position);

//document.getElementById("AnimationButton").addEventListener("click", rays(scene, veto_wall, vwdimensions));
// document.getElementById("AnimationButton").onclick = rays(scene, veto_wall, vwdimensions);
const raygroup = new THREE.Group();
rays(scene, raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot);

// microball.children[1].children[1].material.transparent = true;
// microball.children[1].children[1].material.opacity = 0;
// microball.children[1].children[1].material.color = 0x00F844;


function animate() {
    // TWEEN.update();
    // requestAnimationFrame(animate);
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
    TWEEN.update();
    // controls.update(.05); //flycontrols
    // microball.rotateX(.01);
    // microball.position.set(microball.position.x+=.1, 0,0); //can make object follow parametric curve this way
};

animate();


