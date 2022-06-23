import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function create_ray(veto_wall, neutron_wall, vwdimensions, ndimensions, rot)
{
    const geometry = new THREE.CylinderGeometry(.75,.75,50,32);
    const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
    const ray = new THREE.Mesh(geometry, material);

    //sets random destination and time to get there for the ray
    //TO-DO: not sure if the rays are going off the left of the neutron wall as much as they're going off the right
    ray.geometry.rotateX(Math.PI/2);
    const xdiff = Math.random() * ndimensions.x;
    const x_ray_pos = (neutron_wall.position.x - .5 * xdiff) + 2 * xdiff * Math.cos(Math.PI/2 - rot); //some rays go to the left and right of the neutron wall on the same plane
    const y_ray_pos = (-.5 * ndimensions.y) + Math.random() * ndimensions.y * 2; //some rays go above and below neutron wall on the same plane
    const z_ray_pos = (neutron_wall.position.z - .5 * xdiff) + 2 * xdiff * Math.sin(Math.PI/2 - rot);
    const time = 3000 + Math.random() * 2000; //sets the time it takes the ray to get to its target bw 3 and 5 seconds, therefore setting the speed
    const target = new THREE.Vector3(x_ray_pos, y_ray_pos, z_ray_pos);
    ray.lookAt(target);

    return {ray, target, time};
}

export function animations(raygroup, veto_wall, neutron_wall, vwdimensions, ndimensions, rot, num_of_rays, cubevw, cuben)
{
    cubevw.updateWorldMatrix(); //needed to make raycaster work outside render loop
    cuben.updateWorldMatrix();

    for(let i = 0; i < num_of_rays; i++)
    {
        const {ray, target, time} = create_ray(veto_wall, neutron_wall, vwdimensions, ndimensions, rot);
        raygroup.add(ray);

        const origin = new THREE.Vector3(0,0,0);
        const speed = origin.distanceTo(target)/time;
        
        //casts ray from origin in direction of target vector for each ray
        const raycaster = new THREE.Raycaster(origin, target.clone().normalize());
        const intersects = raycaster.intersectObjects([cubevw, cuben]); //list of all intersection points with cubevw and cuben
        intersects.forEach(intersection => {
            //TO-DO: make create_sphere a separate function
            const sphere = new THREE.Mesh( new THREE.SphereGeometry(5, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
            sphere.position.set(intersection.point.x, intersection.point.y, intersection.point.z); //adds sphere at point of each intersection for each ray
            raygroup.add(sphere);
            sphere.material.transparent = true;
            sphere.material.opacity = 0;
            
            const intersect_point = new THREE.Vector3(intersection.point.x, intersection.point.y, intersection.point.z);
            const intersect_time = origin.distanceTo(intersect_point)/speed;
            //TO-DO: the spheres show up slightly before the collision for some of the rays, so change the timing later

            //animates the spheres to fade in and out with collision
            createjs.Tween.get(sphere.material, {loop: true}).wait(intersect_time - 500).to({opacity : 1}, 0).to({opacity:0}, 500).wait(time - intersect_time);
        });

        //animates rays to move to target
        createjs.Tween.get(ray.position, {loop: true}).to({x: target.x, y: target.y, z: target.z}, time);
    }
    
}
