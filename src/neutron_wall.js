import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function create_bar(i, x_dist, y_dist, z_dist, spacing)
{
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
    let material = new THREE.MeshLambertMaterial(materialProperties);
    const bar = new THREE.Mesh(geometry, material);
    bar.position.x += x_dist/2;

    if(i != 0)
    {
        bar.position.y += i * (y_dist + spacing);
    }
    
    return bar;
}

function set_position(neutron_wall, y_dist, rot, ndist)
{
    const nboundingBox = new THREE.Box3().setFromObject(neutron_wall);
    let ndimensions = new THREE.Vector3();
    nboundingBox.getSize(ndimensions); //vector containing the width, height, and depth of the bounding box of the neutron wall

    //sets the position of the wall because the veto_wall position is set relative to the bottom left corner, not the center
    neutron_wall.position.set(ndist * Math.cos(rot) - .5 * ndimensions.x * Math.sin(rot), neutron_wall.position.y, -1 * (ndist * Math.sin(rot) + .5 * ndimensions.x * Math.cos(rot)))
    neutron_wall.rotateY(-1*(Math.PI/2 - rot));

    neutron_wall.position.y += y_dist/2 - 110.8049;

    return ndimensions;
}

//invisible box of same size and position as neutron wall for the collision detection
function create_cuben(neutron_wall, ndimensions, rot, ndist, y_dist)
{
    const cuben = new THREE.Mesh( new THREE.BoxGeometry(ndimensions.x, ndimensions.y, ndimensions.z), new THREE.MeshBasicMaterial({color : 0xffffff}));
    cuben.rotateY(-1*(Math.PI/2 - rot));
    //position set from center of wall
    cuben.position.set(ndist * Math.cos(rot), neutron_wall.position.y + ndimensions.y/2 - y_dist/2, ndist * Math.sin(rot) * -1);
    cuben.material.transparent = true;
    cuben.material.opacity = 0;
    return cuben;
}

//x_dist: width of each bar, y_dist: height of each bar, z_dist: depth of each bar
//spacing: distance bw each bar
//ndist: the dist of the center of the neutron wall from the origin from the top view
//rot: angle between the x axis and the line from the origin to the center of the neutron wall from top view
export function create_neutron_wall(neutron_wall, bar_num, x_dist, y_dist, z_dist, spacing, rot, ndist)
{
    for (let i = 0; i < bar_num; i++)
    {
        neutron_wall.add(create_bar(i, x_dist, y_dist, z_dist, spacing));
    }

    const ndimensions = set_position(neutron_wall, y_dist, rot, ndist);
    const cuben = create_cuben(neutron_wall, ndimensions, rot, ndist, y_dist);
    return {ndimensions, cuben};
}