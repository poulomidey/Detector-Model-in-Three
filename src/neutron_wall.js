import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

export function create_neutron_wall(scene, neutron_wall, bar_num, x_dist, y_dist, z_dist, spacing, dist_bw_neutron_veto, v_wall_z_dist)
{
    for (let i = 0; i < bar_num; i++) {
        const geometry = new THREE.BoxGeometry(x_dist, y_dist, z_dist);
        let materialProperties;
        if (i % 2 == 0) {
            materialProperties = {
                color: "hsl(228, 100%, 78%)",
            };
        } else {
            materialProperties = {
                color: "hsl(228, 100%, 50%)",
            };
        }
        let material = new THREE.MeshBasicMaterial(materialProperties);
        const bar = new THREE.Mesh(geometry, material);
        bar.position.x += x_dist/2;
    
        if(i != 0)
        {
            bar.position.y += i * (y_dist + spacing);
        }
        
        neutron_wall.add(bar);
    }
    
    scene.add(neutron_wall);
    neutron_wall.position.z -= dist_bw_neutron_veto + (2*v_wall_z_dist + .3)/2;
    neutron_wall.position.y += y_dist/2;
}