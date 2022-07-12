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
        if(Math.random() < 0.25) //25% of the particles are neutrons, or the collision is only detected with the neutron wall, not the veto wall.
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
            //TO-DO: the spheres show up slightly before the collision for some of the rays, so change the timing later
            //the sphere should be there the whole time the ray is intersecting with the wall

            //animates the spheres to fade in and out with collision
            createjs.Tween.get(sphere.material, {loop: true}).wait(intersect_time - 500).to({opacity : 1}, 0).to({opacity:0}, 500).wait(time - intersect_time);
            createjs.Tween.get(sphere.material, {loop: true}).wait(intersect_time - sphere_time/2).to({opacity : 1}, 0).to({opacity:0}, sphere_time).wait(time - intersect_time - sphere_time/2);
        }

        // const intersects_microball = raycaster.intersectObjects(traps);
        // intersects_microball.forEach(intersection => {
        //     // intersection.object.material.color.set(0x0400FF);
        //     const wait_time = intersection.distance/speed;
        //     if(microball_intersects.has(intersection.object))
        //     {
        //         microball_intersects.get(intersection.object).push(wait_time);
        //     }
        //     else
        //     {
        //         microball_intersects.set(intersection.object, [wait_time]);
        //     }
        //     //maybe the animations aren't lining up bc 
        //     createjs.Tween.get(intersection.object.material.color, {loop: true})
        //         .wait(wait_time)
        //         .to({r: 0, g: 0, b: 1}, 0)
        //         .wait(200)
        //         .to({r: .561, g: 0, b: .961}, 0)
        //         .wait(time - wait_time - 200);
        // });

        //make tweens be triggered by the start of the ray loop

        //animates rays to move to target
        createjs.Tween.get(ray.position, {loop: true}).to({x: target.x, y: target.y, z: target.z}, time);
    }

    // microball_intersects.forEach((value, key) => {
    //     // console.log(value);
    //     value.sort(function(a, b){return a - b});
    //     //this won't work because the rays are on different time loops, so from the trap's perspective, the timing that each ray hits it changes in relation to each other every time (predictably but still), so you can't make a single short loop for it.
    //     let color_change = createjs.Tween.get(key.material.color, {loop: true})
    //         .wait(value[0])
    //         .to({r: 0, g: 0, b: 1}, 0)
    //         .wait(200)
    //         .to({r: .561, g: 0, b: .961}, 0);
    // });

    console.log(microball_intersects);
    
}
