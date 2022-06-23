import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function create_ray(veto_wall, neutron_wall, vwdimensions, ndimensions, rot)
{
    const geometry = new THREE.CylinderGeometry(.75,.75,50,32);
    const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
    const ray = new THREE.Mesh(geometry, material);

    //fix so rays go a consistent dist above/below and left/right of the neutron wall
    ray.geometry.rotateX(Math.PI/2);
    const xdiff = Math.random() * ndimensions.x;
    const x_ray_pos = (neutron_wall.position.x - .5 * xdiff) + 2 * xdiff * Math.cos(Math.PI/2 - rot);
    const y_ray_pos = (-.5 * ndimensions.y) + Math.random() * ndimensions.y * 2;
    const z_ray_pos = (neutron_wall.position.z - .5 * xdiff) + 2 * xdiff * Math.sin(Math.PI/2 - rot);
    const time = 3000 + Math.random() * 2000;
    const target = new THREE.Vector3(x_ray_pos, y_ray_pos, z_ray_pos);
    ray.lookAt(target);

    return {ray, target, time};
}

// function generic_sphere(pos)
// {
//     const sphere = new THREE.Mesh( new THREE.SphereGeometry(5, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
//     sphere.material.transparent = true;
//     sphere.material.opacity = 0;
//     sphere.position.set(pos.x, pos.y, pos.z);
//     return sphere;
// }

// function calc_veto_target(target)
// {
//     const xv = 620.1/(1.219 - target.z/target.x);
//     const zv = target.z * (xv/target.x);
//     const yv = target.y * (xv/target.x);
//     return new THREE.Vector3(xv, yv, zv); 
// }

export function animations(scene, raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot, num_of_rays, cubevw, cuben)
{
    // const targetAndTime = [];
    cubevw.updateWorldMatrix();
    cuben.updateWorldMatrix();

    for(let i = 0; i < num_of_rays; i++)
    {
        const {ray, target, time} = create_ray(veto_wall, neutron_wall, vwdimensions, ndimensions, rot);
        raygroup.add(ray);

        // targetAndTime.push([target, time]);

        // const spheren = generic_sphere(target);
        // raygroup.add(spheren);

        // const veto_target = calc_veto_target(target);
        const origin = new THREE.Vector3(0,0,0);

        const speed = origin.distanceTo(target)/time;
        // const veto_time = origin.distanceTo(veto_target)/speed;
        
        const raycaster = new THREE.Raycaster(origin, target.clone().normalize());
        const intersects = raycaster.intersectObjects([cubevw, cuben]);
        intersects.forEach(intersection => {
            const sphere = new THREE.Mesh( new THREE.SphereGeometry(5, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
            sphere.position.set(intersection.point.x, intersection.point.y, intersection.point.z);
            raygroup.add(sphere);
            sphere.material.transparent = true;
            sphere.material.opacity = 0;
            
            const intersect_point = new THREE.Vector3(intersection.point.x, intersection.point.y, intersection.point.z);
            const intersect_time = origin.distanceTo(intersect_point)/speed;
            createjs.Tween.get(sphere.material, {loop: true}).wait(intersect_time - 500).to({opacity : 1}, 0).to({opacity:0}, 500).wait(time - intersect_time);
        });

        // const spherev = generic_sphere(veto_target);
        // raygroup.add(spherev);
        
        // createjs.Tween.get(spherev.material, {loop: true}).wait(veto_time - 500).to({opacity : 1}, 0).to({opacity:0}, 500).wait(time - veto_time);
        // createjs.Tween.get(spheren.material, {loop: true}).wait(time - 500).to({opacity : 1}, 0).to({opacity:0}, 500);
        createjs.Tween.get(ray.position, {loop: true}).to({x: target.x, y: target.y, z: target.z}, time);
    }
    scene.add(raygroup);
    // return targetAndTime;
}
