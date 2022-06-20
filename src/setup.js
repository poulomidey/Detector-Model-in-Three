import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

export function setup(scene, camera, renderer,controls)
{
    
    //lighting and fog
    // scene.background = new THREE.Color( 0xffffff );
    const directionalLight = new THREE.DirectionalLight( 0xffffff, .5);
    scene.add( directionalLight );
    directionalLight.position.y = 300;

    const light = new THREE.AmbientLight( 0xffffff );
    scene.add( light );

    // scene.fog = new THREE.Fog(0x000000, 200, 1000);
    scene.fog = new THREE.FogExp2(0x000000, .001);

    //camera initial setup
    camera.position.set(-200, 200, 200);
    // camera.position.set(600,200,0);
    camera.lookAt(0, 0, 0);
    // camera.lookAt(veto_wall.position.x, veto_wall.position.y, veto_wall.position.z);
    controls.update();

    //grid
    const size = 900;
    const divisions = 50;
    const gridHelper = new THREE.GridHelper( size, divisions );
    scene.add( gridHelper );

    //axis
    // const axesHelper = new THREE.AxesHelper( 600 );
    // scene.add( axesHelper );

    const cameraGroup = new THREE.Group();
    // cameraGroup.position.set(150,50,-150);  // Set the initial VR Headset Position.
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

}