import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
// import {FlyControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/FlyControls.js';
import {create_neutron_wall} from "./neutron_wall.js";
import {create_veto_wall} from "./veto_wall.js";
import {create_microball} from "./microball.js";
import {setup} from "./setup.js";
import {animations} from "./ray_animation.js";

const rot = .6871;

let {scene, camera, renderer, controls} = setup();

const neutron_wall = new THREE.Group();
const {ndimensions, cuben} = create_neutron_wall(scene, neutron_wall, 24, 193.675, 8.255, 6.985, .3175, rot, 441.6);
scene.add(neutron_wall);
scene.add(cuben);

const veto_wall = new THREE.Group();
const {vwdimensions, cubevw} = create_veto_wall(scene, veto_wall, 23, 9.398, 227.2362, 1.0008, .3, .15, rot, 393.3);
scene.add(veto_wall);
scene.add(cubevw);

const microball = new THREE.Group();
//The first entry in the nested list for traps_to_remove is the ring, the rest are the crystals to remove within the ring. The order of the traps within a ring must be listed in increasing order (maybe later can sort before removing)
create_microball(scene, microball, [1,6,9], [[3,3,4,5,6],[4,4,5,6],[5,4,5,6]]);

const raygroup = new THREE.Group();
animations(scene, raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot, 40, cubevw, cuben);

function animate() {
    // requestAnimationFrame(animate);
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
    // controls.update(.05); //flycontrols
};

animate();


