import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

function create_bar(i, x_dist, y_dist, z_dist, x_spacing, z_spacing)
{
    let zigzag = z_spacing + z_dist/2; //sets spacing bw the bars but including the z_dist of the bars so it's accurate
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
    const vwboundingBox = new THREE.Box3().setFromObject(veto_wall);
    let vwdimensions = new THREE.Vector3();
    vwboundingBox.getSize(vwdimensions);//vector containing the width, height, and depth of the bounding box of the neutron wall

    //sets the position of the wall because the veto_wall position is set relative to the bottom left corner, not the center
    veto_wall.position.set(vwdist * Math.cos(rot) - .5 * vwdimensions.x * Math.sin(rot), 0, -1 * (vwdist * Math.sin(rot) + .5 * vwdimensions.x * Math.cos(rot)))
    veto_wall.rotateY(-1*(Math.PI/2 - rot));

    return vwdimensions;
}

//invisible box of same size and position as veto wall for the collision detection
function create_cubevw(vwdimensions, rot, vwdist)
{
    const cubevw = new THREE.Mesh( new THREE.BoxGeometry(vwdimensions.x, vwdimensions.y, vwdimensions.z), new THREE.MeshBasicMaterial({color : 0xffffff}));
    cubevw.rotateY(-1*(Math.PI/2 - rot));
    //position set from center of wall
    cubevw.position.set(vwdist * Math.cos(rot), vwdimensions.y/2, vwdist * Math.sin(rot) * -1);
    //TO-DO: it's off in the local x direction a little bit, because the veto wall is. Could be errors if a collision is on the edges
    cubevw.material.transparent = true;
    cubevw.material.opacity = 0;
    return cubevw;
}

//x_dist: width of each bar, y_dist: height of each bar, z_dist: depth of each bar
//x_spacing: the width of the overlap bw each bar
//z_spacing: 1/2 of the distance bw the bars in the z direction
//vwdist: the dist of the center of the veto wall from the origin from the top view
//rot: angle between the x axis and the line from the origin to the center of the veto wall from top view
export function create_veto_wall(veto_wall, bar_num, x_dist, y_dist, z_dist, x_spacing, z_spacing, rot, vwdist)
{
    for(let i = 1; i <= bar_num; i++)
    {
        veto_wall.add(create_bar(i, x_dist, y_dist, z_dist, x_spacing, z_spacing));
    }
    
    const vwdimensions = set_position(veto_wall, x_dist, rot, vwdist)
    const cubevw = create_cubevw(vwdimensions, rot, vwdist);
    return {vwdimensions, cubevw};
}
