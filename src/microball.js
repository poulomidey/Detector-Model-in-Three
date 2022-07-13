import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';

//ay, az, cy, cz are the coordinates of the top right corner and bottom right corner of the first trapezoid when it's flat in the yz plane
//(but trap is created in xz plane since it's a 2D shape, later rotated)
function create_trap(ay, az, cy, cz, shiftDown, thickness)
{
  //trapezoids shifted down so that the created trapezoid is centers on the origin when it's created so the rotation works right later
  let coordinatesList = [
    new THREE.Vector2(az, ay - shiftDown),
    new THREE.Vector2(-1*az, ay - shiftDown),
    new THREE.Vector2(-1*cz,cy - shiftDown),
    new THREE.Vector2(cz,cy - shiftDown),
  ];

  let shape = new THREE.Shape(coordinatesList);

  //allows you to see trap from both sides
  const extrudeSettings = {
    steps: 2,
    depth: thickness,
    bevelEnabled: false,
  };

  let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const material = new THREE.MeshLambertMaterial( { color: "hsl(275, 100%, 48%)" } );
  let trap = new THREE.Mesh(geometry, material);
  trap.material.transparent = true;

  return trap;
}

//rotates and translates to set correct position of each trapezoid
function set_position(trap, i, n, theta, x_pos, yshift, ydist)
{
  trap.geometry.rotateY(Math.PI/2); //rotates trap so it's flat in the yz plane
  trap.position.y = ydist/2; //translates up so the bottom of the trap is flush with the z axis
  
  trap.rotation.x = ((2*Math.PI)/n)*i; //rotates around local axis so it's pointing in the right direction, like for each triangle in a regular polygon
  trap.rotation.z = theta; //tilts the trap back around local axis

  let matrixZ = new THREE.Matrix4();
  matrixZ.makeRotationZ(theta);
  trap.position.applyMatrix4(matrixZ); //moves the trap to the correct position for the rotation around the z axis tilting it back

  trap.position.y = yshift; //moves trap to correct height

  let matrixX = new THREE.Matrix4(); 
  matrixX.makeRotationX(((2*Math.PI)/n)*i);
  trap.position.applyMatrix4(matrixX); //moves the trap to the correct position for the rotation around the x axis

  trap.position.x = x_pos; //moves the traps in a ring to the right position on the x axis for the microball
}

function create_ring(ring, microball, n, theta, x_pos, ay, az, cy, cz, yshift, ydist, thickness)
{
  for(let i = 0; i < n; i++)
  {
    const shiftDown = cy + ydist/2;
    const trap = create_trap(ay, az, cy, cz, shiftDown, thickness);
    set_position(trap, i, n, theta, x_pos, yshift, ydist);
    
    ring.add(trap);
  }
  microball.add(ring);
}

//reduces the opacity of entire rings that aren't being used
function remove_ring(microball, rings_to_remove, trap_opacity)
{
  rings_to_remove.forEach(ring => {
    microball.children[ring - 1].children.forEach(trap => {
      trap.material.opacity = trap_opacity;
    });
  });
}

//reduces the opacity of individual crystals that aren't being used
function remove_trap(microball, traps_to_remove, trap_opacity)
{
  traps_to_remove.forEach(row => {
    for(let i = row.length - 1; i > 0; i--)
    {
      microball.children[row[0] - 1].children[row[i] - 1].material.opacity = trap_opacity;
    }
});
}

export function create_microball(microball, rings_to_remove = [], traps_to_remove = [])
{
  let input =
  `n_dets,theta,x_pos,ay,az,cy,cz,y_shift,y_dist,thickness_1
  6,0.157079633,108.6457175,26.95002851,15.42279225,7.702522536,4.447053459,17.20779115,19.24750598,2.7
  10,0.366519143,74.68643412,39.14462469,12.29488884,19.49909494,6.335640006,28.66943596,19.64552974,2.4
  12,0.628318531,48.54101966,45.31001988,11.27774318,28.44511972,7.621846857,35.26711514,16.86490016,2.2
  12,0.907571211,30.78307377,49.12834227,11.71656519,35.0742588,9.39811932,39.40053768,14.05408347,1.9
  14,1.221730476,17.10100717,61.60196015,11.41217372,43.96926208,10.03569714,46.98463104,17.63269807,1.6
  14,1.570796327,3.06E-15,67.63269807,11.41217372,50,11.41217372,50,17.63269807,1.5
  12,1.946042116,-16.4925552,63.53494579,10.31961896,45.22423884,12.11779828,41.86879056,18.31070695,1.5
  10,2.35619449,-33.23401872,60.27844426,8.503119197,40.29812746,13.09365533,33.23401872,19.9803168,1.3
  6,2.775073511,-46.67902132,49.09598592,4.616761337,27.84032975,16.07362188,17.91839748,21.25565617,1.1
  `;
  let points = Papa.parse(input); //puts the contents of the csv string into a 2D array
  
  //makes the entire microball by looping through the data for every ring
  for(let i = 1; i < points.data.length; i++)
  {
    const ring = new THREE.Group();
    create_ring(ring, microball, parseInt(points.data[i][0]), parseFloat(points.data[i][1]), parseFloat(points.data[i][2])/10, parseFloat(points.data[i][3])/10, parseFloat(points.data[i][4])/10, parseFloat(points.data[i][5])/10, parseFloat(points.data[i][6])/10, parseFloat(points.data[i][7])/10, parseFloat(points.data[i][8])/10, parseFloat(points.data[i][9])/10);
  }

  // microball.scale.set(.1,.1,.1);

  //reduces opacity of rings/traps as necessary
  const trap_opacity = .25;
  remove_ring(microball, rings_to_remove, trap_opacity);
  remove_trap(microball, traps_to_remove, trap_opacity)
}