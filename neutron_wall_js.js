// import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";
// import { OrbitControls } from "https://unpkg.com/three/examples/jsm/controls/OrbitControls.js";

let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const scene = new THREE.Scene();

// const controls = new OrbitControls( camera, renderer.domElement );

const board = new THREE.Group();

let odd_color = 0x8DA3FF;
let even_color = 0x0132FF;

for(let i = 0; i < 24; i++)
{
    const geometry = new THREE.BoxGeometry(193.675,8.255,6.985);
    let material;
    if((i+1) % 2 == 1)
    {
    	material = new THREE.MeshBasicMaterial( { color: odd_color } );
    }
    else
    {
    	material = new THREE.MeshBasicMaterial( { color: even_color } );
    }
    const cube = new THREE.Mesh( geometry, material );
    cube.position.y = i * 8.255;
    board.add(cube);
}

scene.add(board);

// const geometry = new THREE.BoxGeometry(193.675,8.255,6.985);
// const material = new THREE.MeshBasicMaterial( { color: odd_color } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.set(200,200,200);
camera.lookAt(0,0,0);
// controls.update();



function animate() {
    requestAnimationFrame( animate );

    // cube.rotation.x += 0.01;
    // cube.rotation.y += 0.01;
    // controls.update();

    renderer.render( scene, camera );
};

animate();