import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
// import { Raycaster } from 'three';
// import { TWEEN } from 'https://unpkg.com/three@0.139.0/examples/jsm/libs/tween.module.min.js';

export function rays(scene, raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot)
{
    const objects = veto_wall.children.concat(neutron_wall.children); //when you get this to work, move it out of the for loop

    // const cube = new THREE.Mesh( new THREE.BoxGeometry(300,300,5), new THREE.MeshBasicMaterial({color : 0xffffff}));
    // scene.add(cube);
    // cube.position.set(100,0,-100);
    for(let i = 0; i < 25; i++)
    {
        const geometry = new THREE.CylinderGeometry(.75,.75,50,32);
        const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
        const ray = new THREE.Mesh(geometry, material);
        // ray.position.set(0,0,100);
        
        //veto wall version
        // ray.geometry.rotateX(Math.PI/2);
        // const xdiff = Math.random() * vwdimensions.x;
        // const x_ray_pos = veto_wall.position.x + xdiff*Math.cos(Math.PI/2 - rot);
        // const y_ray_pos = veto_wall.position.y + Math.random() * vwdimensions.y;
        // const z_ray_pos = veto_wall.position.z + xdiff*Math.sin(Math.PI/2 - rot);
        // const time = 3000 + Math.random() * 2000;
        // ray.lookAt(x_ray_pos, y_ray_pos, z_ray_pos);

        //neutron wall version
        ray.geometry.rotateX(Math.PI/2);
        const xdiff = Math.random() * ndimensions.x;
        const x_ray_pos = neutron_wall.position.x + xdiff*Math.cos(Math.PI/2 - rot);
        const y_ray_pos = Math.random() * ndimensions.y;
        const z_ray_pos = neutron_wall.position.z + xdiff*Math.sin(Math.PI/2 - rot);
        const time = 3000 + Math.random() * 2000;
        const target = new THREE.Vector3(x_ray_pos, y_ray_pos, z_ray_pos);
        ray.lookAt(target);

        raygroup.add(ray);

        const sphere = new THREE.Mesh( new THREE.SphereGeometry(7, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
        sphere.material.transparent = true; //can try messing with the emissiveness property and see if that makes it look better, but if it doesn't then you can just switch back tot he basic material
        sphere.material.opacity = 0;
        sphere.position.set(x_ray_pos, y_ray_pos, z_ray_pos);
        raygroup.add(sphere);

        // const sphere_time = (50 * time)/Math.sqrt(x_ray_pos**2 + y_ray_pos**2 + z_ray_pos**2);

        // const xv = 510.25/(.8205 - z_ray_pos/x_ray_pos);
        const xv = 620.1/(1.219 - z_ray_pos/x_ray_pos);
        const zv = z_ray_pos * (xv/x_ray_pos);
        const yv = y_ray_pos * (xv/x_ray_pos);

        const veto_target = new THREE.Vector3(xv, yv, zv);
        const origin = new THREE.Vector3(0,0,0);

        const speed = origin.distanceTo(target)/time;
        const veto_time = origin.distanceTo(veto_target)/speed;

        const spherev = new THREE.Mesh( new THREE.SphereGeometry(7, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
        spherev.material.transparent = true;
        spherev.material.opacity = 0;
        spherev.position.set(xv, yv, zv);
        raygroup.add(spherev);
        
        createjs.Tween.get(spherev.material, {loop: true}).wait(veto_time - 500).to({opacity : 1}, 0).to({opacity:0}, 500).wait(time - veto_time);
        createjs.Tween.get(sphere.material, {loop: true}).wait(time - 500).to({opacity : 1}, 0).to({opacity:0}, 500);
        createjs.Tween.get(ray.position, {loop: true}).to({x: x_ray_pos, y: y_ray_pos, z: z_ray_pos}, time);

        
        // const raycaster = new THREE.Raycaster(new THREE.Vector3(0,0,0), target.clone().normalize());
        

        // let objects = [];
        // veto_wall.children.forEach(bar => {
        //     const world = new THREE.Vector3;
        //     bar.getWorldPosition(world);
        //     objects.push(world);
        // });
        // neutron_wall.children.forEach(bar => {
        //     const world = new THREE.Vector3;
        //     bar.getWorldPosition(world);
        //     objects.push(world);
        // });

        // const cube = new THREE.Mesh( new THREE.BoxGeometry(300,300,5), new THREE.MeshBasicMaterial({color : 0xffffff}));
        // scene.add(cube);
        // cube.position.set(100,0,-100);

        // const objects = [neutron_wall, veto_wall, cube];
        // const intersects = raycaster.intersectObject(cube);
        // console.log(intersects);
        // console.log(veto_wall.children);
        // console.log(objects);
        // intersects.forEach(intersection => {
        //     const sp = new THREE.Mesh( new THREE.SphereGeometry(7, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
        //     sp.position.set(intersection.point.x, intersection.point.y, intersection.point.y);
        //     console.log(intersection.point.x, intersection.point.y, intersection.point.y);
        //     scene.add(sp);

        //     // intersection.object.material.color.set( 0xff0000 );
        // });
    
    }
    scene.add(raygroup);
}
