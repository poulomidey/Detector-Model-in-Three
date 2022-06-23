import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function create_bar(i, x_dist, y_dist, z_dist, x_spacing, z_spacing)
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
    let material = new THREE.MeshLambertMaterial(materialProperties);
    const bar = new THREE.Mesh(geometry, material);
    bar.position.y += y_dist/2;
    bar.position.z += zigzag;
    if(i != 0)
    {
        bar.position.x += i * (x_dist - x_spacing);
    }
    
    return bar;
}

function set_position(veto_wall, x_dist, rot, vwdist)
{
    // veto_wall.position.x -= x_dist/2;
    // veto_wall.geometry.x = x_dist/2;

    const vwboundingBox = new THREE.Box3().setFromObject(veto_wall);
    let vwdimensions = new THREE.Vector3();
    vwboundingBox.getSize(vwdimensions);

    veto_wall.position.set(vwdist * Math.cos(rot) - .5 * vwdimensions.x * Math.sin(rot), 0, -1 * (vwdist * Math.sin(rot) + .5 * vwdimensions.x * Math.cos(rot)))
    veto_wall.rotateY(-1*(Math.PI/2 - rot));

    return vwdimensions;
}

function create_cubevw(vwdimensions, rot, vwdist)
{
    const cubevw = new THREE.Mesh( new THREE.BoxGeometry(vwdimensions.x, vwdimensions.y, vwdimensions.z), new THREE.MeshBasicMaterial({color : 0xffffff}));
    cubevw.rotateY(-1*(Math.PI/2 - rot));
    cubevw.position.set(vwdist * Math.cos(rot), vwdimensions.y/2, vwdist * Math.sin(rot) * -1);
    //it's off in the local x direction a little bit, because the veto wall is. Could be errors if a collision is on the edges
    cubevw.material.transparent = true;
    cubevw.material.opacity = 0;
    return cubevw;
}

export function create_veto_wall(scene, veto_wall, bar_num, x_dist, y_dist, z_dist, x_spacing, z_spacing, rot, vwdist)
{
    for(let i = 1; i <= bar_num; i++)
    {
        veto_wall.add(create_bar(i, x_dist, y_dist, z_dist, x_spacing, z_spacing));
    }
    
    const vwdimensions = set_position(veto_wall, x_dist, rot, vwdist)
    const cubevw = create_cubevw(vwdimensions, rot, vwdist);
    return {vwdimensions, cubevw};
}
