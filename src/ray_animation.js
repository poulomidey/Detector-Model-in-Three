import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
// import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

export function rays(scene, raygroup, veto_wall, vwdimensions, rot)
{
    //add dictionary to store the direction of the ray
    for(let i = 0; i < 25; i++)
    {
        const geometry = new THREE.CylinderGeometry(.75,.75,50,32);
        const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
        const ray = new THREE.Mesh(geometry, material);
        // ray.position.set(0,0,100);
        
        ray.geometry.rotateX(Math.PI/2);
        const xdiff = Math.random() * vwdimensions.x;
        const x_ray_pos = veto_wall.position.x + xdiff*Math.cos(Math.PI/2 - rot);
        const y_ray_pos = veto_wall.position.y + Math.random() * vwdimensions.y;
        const z_ray_pos = veto_wall.position.z + xdiff*Math.sin(Math.PI/2 - rot);
        const time = 3000 + Math.random() * 2000;
        ray.lookAt(x_ray_pos, y_ray_pos, z_ray_pos);

        raygroup.add(ray);

        const sphere = new THREE.Mesh( new THREE.SphereGeometry(5, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
        sphere.material.transparent = true; //can try messing with the emissiveness property and see if that makes it look better, but if it doesn't then you can just switch back tot he basic material
        sphere.material.opacity = 0;
        sphere.position.set(x_ray_pos, y_ray_pos, z_ray_pos);
        raygroup.add(sphere);
        
        // var lightTween = new createjs.Tween.get(sphere.material).to({opacity : 1}, 0).to({opacity:0}, 500);
        createjs.Tween.get(sphere.material, {loop: true}).wait(time - 500).to({opacity : 1}, 0).to({opacity:0}, 500);
        createjs.Tween.get(ray.position, {loop: true}).to({x: x_ray_pos, y: y_ray_pos, z: z_ray_pos}, time);
        // let tweenRays = new TWEEN.Tween(ray.position).to({x: x_ray_pos, y: y_ray_pos, z: z_ray_pos}, time).repeat(Infinity).start();
        // let tweenSpheres = new TWEEN.Tween(sphere.material).delay(time - 500).to({opacity : 1}, 0).to({opacity:0}, 500).repeat(Infinity).start();
        // tweenRays.chain(tweenSpheres);
        // const rayBoundingBox = new THREE.Box3().setFromObject(ray);
        // veto_wall.children.forEach(bar => {
        //     const barBoundingBox = new THREE.Box3().setFromObject(bar);
        //     if(rayBoundingBox.intersectsBox(barBoundingBox))
        //     {
        //         // bar.material.color = 0x00F844;
        //         const sphere = new THREE.Mesh( new THREE.SphereGeometry(5, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
        //         sphere.material.transparent = true; //can try messing with the emissiveness property and see if that makes it look better, but if it doesn't then you can just switch back tot he basic material
        //         sphere.material.opacity = 1;
        //         sphere.position.set(x_ray_pos, y_ray_pos, z_ray_pos);
        //         scene.add(sphere);

                
        //     }
        // });
    }
    scene.add(raygroup);

    // raygroup.children.forEach(ray => {

    // });
}
