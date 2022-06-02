import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

export function create_veto_wall(scene, veto_wall, bar_num, x_dist, y_dist, z_dist, x_spacing, z_spacing)
{
    for(let i = 1; i <= bar_num; i++)
    {
        let zigzag = z_spacing + z_dist/2;
        const geometry = new THREE.BoxGeometry(x_dist, y_dist, z_dist);
        let materialProperties;
        if (i % 2 != 0) {
            materialProperties = {
                color: "hsl(320, 0%, 79%)",
            };
            zigzag *= -1;
        } else {
            materialProperties = {
                color: "hsl(320, 0%, 49%)",
            };
        }
        let material = new THREE.MeshBasicMaterial(materialProperties);
        const bar = new THREE.Mesh(geometry, material);
        bar.position.y += y_dist/2;
        bar.position.z += zigzag;
        if(i != 0)
        {
            bar.position.x += i * (x_dist - x_spacing);
        }
        
        veto_wall.add(bar);
    
    }
    veto_wall.position.x -= x_dist/2;
    scene.add(veto_wall);
}
