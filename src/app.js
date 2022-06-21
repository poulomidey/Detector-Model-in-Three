import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
// import {FlyControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/examples/jsm/controls/FlyControls.js';
import {create_neutron_wall} from "./neutron_wall.js";
import {create_veto_wall} from "./veto_wall.js";
import {create_microball} from "./microball.js";
import {setup} from "./setup.js";
import {rays} from "./ray_animation.js";

let {scene, camera, renderer, controls} = setup();

// const v_wall_z_dist = 1.0008;
// const dist_bw_neutron_veto = 61.085; //DOUBLE CHECK DIST BW N WALL AND V WALL. IS N WALL TILTED?

const neutron_wall = new THREE.Group();
create_neutron_wall(scene, neutron_wall, 24, 193.675, 8.255, 6.985, .3175);

const veto_wall = new THREE.Group();
create_veto_wall(scene, veto_wall, 23, 9.398, 227.2362, 1.0008, .3, .15);

const microball = new THREE.Group();
//[], [[3,3,4,5,6],[4,4,5,6],[5,4,5,6]]: instead of removing the traps, try and make them a lower opacity
create_microball(scene, microball); //The first entry in the nested list for traps_to_remove is the ring, the rest are the crystals to remove within the ring. The order of the traps within a ring must be listed in increasing order (maybe later can sort before removing)

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

const raygroup = new THREE.Group();
let targetAndTime = rays(scene, raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot);
// rays(scene, raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot);
const origin = new THREE.Vector3(0,0,0);
console.log(targetAndTime);

const cubevw = new THREE.Mesh( new THREE.BoxGeometry(vwdimensions.x, vwdimensions.y, vwdimensions.z), new THREE.MeshBasicMaterial({color : 0xffffff}));
scene.add(cubevw);
cubevw.rotateY(-1*(Math.PI/2 - rot));
cubevw.position.set(veto_wall.position.x + (vwdimensions.x/2)*Math.sin(rot), veto_wall.position.y + vwdimensions.y/2, veto_wall.position.z + (vwdimensions.x/2)*Math.cos(rot));
cubevw.material.transparent = true;
cubevw.material.opacity = 0;

const cuben = new THREE.Mesh( new THREE.BoxGeometry(ndimensions.x, ndimensions.y, ndimensions.z), new THREE.MeshBasicMaterial({color : 0xffffff}));
scene.add(cuben);
cuben.rotateY(-1*(Math.PI/2 - rot));
cuben.position.set(neutron_wall.position.x + (ndimensions.x/2)*Math.sin(rot), neutron_wall.position.y + ndimensions.y/2, neutron_wall.position.z + (ndimensions.x/2)*Math.cos(rot));
cuben.material.transparent = true;
cuben.material.opacity = 0;

// microball.children[1].children[1].material.transparent = true;
// microball.children[1].children[1].material.opacity = 0;
// microball.children[1].children[1].material.color = 0x00F844;

// const temp = new THREE.Vector3(0,5,-5);
const temp = new THREE.Vector3(veto_wall.position.x + 10, veto_wall.position.y + 10, veto_wall.position.z);

function animate() {
    // requestAnimationFrame(animate);

    targetAndTime.forEach(unit => { 
        const raycaster = new THREE.Raycaster(origin, unit[0].clone().normalize());
        const intersects = raycaster.intersectObjects([cubevw, cuben]);
        // console.log(intersects);
        intersects.forEach(intersection => {
            const sp = new THREE.Mesh( new THREE.SphereGeometry(7, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
            sp.position.set(intersection.point.x, intersection.point.y, intersection.point.z);
            // console.log(intersection.point.x, intersection.point.y, intersection.point.z);
            scene.add(sp);

            // intersection.object.material.color.set( 0xff0000 );
        });
    });
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);

    // controls.update(.05); //flycontrols
};

animate();


