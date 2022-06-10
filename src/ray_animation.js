
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';


export function rays(scene, veto_wall, vwdimensions)
{
    for(let i = 0; i < 25; i++)
    {
        const geometry = new THREE.CylinderGeometry(.75,.75,50,32);
        const material = new THREE.MeshBasicMaterial({color: 0xFF0000});
        const ray = new THREE.Mesh(geometry, material);
        // ray.position.set(0,0,100);
        scene.add(ray);
        
        ray.geometry.rotateX(Math.PI/2);
        const x_ray_pos = veto_wall.position.x + Math.random() * vwdimensions.x * 2.25;
        const y_ray_pos = veto_wall.position.y + Math.random() * vwdimensions.y * 1.25;
        const z_ray_pos = veto_wall.position.z + Math.random() * vwdimensions.z;
        const time = 3000 + Math.random() * 2000;
        ray.lookAt(x_ray_pos, y_ray_pos, z_ray_pos);

        createjs.Tween.get(ray.position, {loop: true}).to({x: x_ray_pos, y: y_ray_pos, z: z_ray_pos}, time);
    }
}
