import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function create_ray(veto_wall, neutron_wall, microball, vwdimensions, ndimensions, rot)
{
    const geometry = new THREE.CylinderGeometry(.5,.5,25,32);
    const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
    const ray = new THREE.Mesh(geometry, material);

    //sets random destination and time to get there for the ray
    //TO-DO: not sure if the rays are going off the left of the neutron wall as much as they're going off the right
    ray.geometry.rotateX(Math.PI/2);
    const xdiff = Math.random() * ndimensions.x;
    const x_ray_pos = (neutron_wall.position.x - .5 * ndimensions.x * Math.sin(rot)) + 2 * xdiff * Math.sin(rot); //some rays go to the left and right of the neutron wall on the same plane
    const y_ray_pos = (neutron_wall.position.y -.5 * ndimensions.y) + Math.random() * ndimensions.y * 2; //some rays go above and below neutron wall on the same plane
    const z_ray_pos = (neutron_wall.position.z - .5 * ndimensions.x * Math.cos(rot)) + 2 * xdiff * Math.cos(rot);
    const time = 5000 + Math.random() * 4000; //sets the time it takes the ray to get to its target bw 3 and 5 seconds, therefore setting the speed
    const scalar = 1.05 + Math.random()*.5;
    // const time = 3000 + Math.random() * 2000;
    const target = new THREE.Vector3(x_ray_pos, y_ray_pos, z_ray_pos);
    target.multiplyScalar(scalar);
    ray.lookAt(target);

    return {ray, target, time};
}

export function animations(raygroup, veto_wall, neutron_wall, microball, vwdimensions, ndimensions, rot, num_of_rays, cubevw, cuben)
{
    //TO-DO: break this up into more functions
    cubevw.updateWorldMatrix(); //needed to make raycaster work outside render loop
    cuben.updateWorldMatrix();

    let traps = [];
    microball.children.forEach(ring => {
        traps = traps.concat(ring.children);
    });

    microball.children.forEach(ring => {
        ring.children.forEach(trap => {
            trap.updateWorldMatrix();
        });
    });

    let microball_intersects = new Map();

    for(let i = 0; i < num_of_rays; i++)
    {
        const {ray, target, time} = create_ray(veto_wall, neutron_wall, microball, vwdimensions, ndimensions, rot);
        raygroup.add(ray);

        const origin = new THREE.Vector3(0,0,0);
        const speed = origin.distanceTo(target)/time;
        const sphere_time = 25/speed; //25 is the length of the ray
        
        //casts ray from origin in direction of target vector for each ray
        const raycaster = new THREE.Raycaster(origin, target.clone().normalize());

        let start = 0;
        if(Math.random() < 0.5) //50% of the particles are neutrons, or the collision is only detected with the neutron wall, not the veto wall.
        {
            start = 1;
        }
        const intersections = raycaster.intersectObjects([cubevw, cuben]); //list of all intersection points with cubevw and cuben
        for(let i = start; i < intersections.length; i++)
        {
            const sphere = new THREE.Mesh( new THREE.SphereGeometry(5, 32, 16) , new THREE.MeshBasicMaterial({color : 0xffff00 }));
            sphere.position.set(intersections[i].point.x, intersections[i].point.y, intersections[i].point.z); //adds sphere at point of each intersection for each ray
            raygroup.add(sphere);
            sphere.material.transparent = true;
            sphere.material.opacity = 0;
            
            const intersect_point = new THREE.Vector3(intersections[i].point.x, intersections[i].point.y, intersections[i].point.z);
            const intersect_time = origin.distanceTo(intersect_point)/speed;

            createjs.Tween.get(sphere.material, {loop: true})
                .wait(intersect_time - 500)
                .to({opacity : 1}, 0)
                .to({opacity:0}, 500)
                .wait(time - intersect_time);
            createjs.Tween.get(sphere.material, {loop: true})
                .wait(intersect_time - sphere_time/2)
                .to({opacity : 1}, 0)
                .to({opacity:0}, sphere_time)
                .wait(time - intersect_time - sphere_time/2);
        }

        const intersects_microball = raycaster.intersectObjects(traps);
        intersects_microball.forEach(intersection => {
            const trap_copy = new THREE.Mesh(intersection.object.geometry, new THREE.MeshLambertMaterial(0x002FFF));
            raygroup.add(trap_copy);
            trap_copy.material.color.set(0x002FFF);
            trap_copy.material.transparent = true;
            trap_copy.material.opacity = 0;
            trap_copy.position.set(intersection.object.position.x, intersection.object.position.y, intersection.object.position.z);
            trap_copy.rotation.x = intersection.object.rotation.x;
            trap_copy.rotation.y = intersection.object.rotation.y;
            trap_copy.rotation.z = intersection.object.rotation.z;
            const wait_time = intersection.distance/speed;
            createjs.Tween.get(trap_copy.material, {loop: true})
                .wait(wait_time)
                .to({opacity : 1}, 0)
                .wait(200)
                .to({opacity : 0}, 0)
                .wait(time - wait_time - 200);
        });

        //animates rays to move to target
        createjs.Tween.get(ray.position, {loop: true}).to({x: target.x, y: target.y, z: target.z}, time);
    }
}
