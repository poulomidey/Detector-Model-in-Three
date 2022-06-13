import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
// import * as Papa from 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.js';


function create_ring(ring, microball, n, theta, x_pos, ay, az, cy, cz, yshift, ydist)
{
  for(let i = 0; i < n; i++)
  {
      const shiftDown = cy + ydist/2;

      let coordinatesList = [
        new THREE.Vector2(az, ay - shiftDown),
        new THREE.Vector2(-1*az, ay - shiftDown),
        new THREE.Vector2(-1*cz,cy - shiftDown),
        new THREE.Vector2(cz,cy - shiftDown),
      ];
  
      let shape = new THREE.Shape(coordinatesList);

      const extrudeSettings = {
        steps: 2,
        depth: 0,
        bevelEnabled: false,
      };

      let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshLambertMaterial( { color: "hsl(275, 100%, 48%)" } );
      let trap = new THREE.Mesh(geometry, material);
      trap.material.transparent = true;

      trap.geometry.rotateY(Math.PI/2);
      trap.position.y = ydist/2;
      
      trap.rotation.x = ((2*Math.PI)/n)*i;
      trap.rotation.z = theta;
  
      let matrixZ = new THREE.Matrix4();
      matrixZ.makeRotationZ(theta);
      trap.position.applyMatrix4(matrixZ);

      trap.position.y = yshift;

      let matrixX = new THREE.Matrix4();
      matrixX.makeRotationX(((2*Math.PI)/n)*i);
      trap.position.applyMatrix4(matrixX);

      trap.position.x = x_pos;
      
      ring.add(trap);
  }
  microball.add(ring);
}

export function create_microball(scene, microball, rings_to_remove = [], traps_to_remove = [])
{
  let input =
  `n_dets,theta,x_pos,ay,az,cy,cz,y_shift,y_dist
  6,0.157079633,108.6457175,26.95002851,15.42279225,7.702522536,4.447053459,17.20779115,19.24750598
  10,0.366519143,74.68643412,39.14462469,12.29488884,19.49909494,6.335640006,28.66943596,19.64552974
  12,0.628318531,48.54101966,45.31001988,11.27774318,28.44511972,7.621846857,35.26711514,16.86490016
  12,0.907571211,30.78307377,49.12834227,11.71656519,35.0742588,9.39811932,39.40053768,14.05408347
  14,1.221730476,17.10100717,61.60196015,11.41217372,43.96926208,10.03569714,46.98463104,17.63269807
  14,1.570796327,3.06E-15,67.63269807,11.41217372,50,11.41217372,50,17.63269807
  12,1.946042116,-16.4925552,63.53494579,10.31961896,45.22423884,12.11779828,41.86879056,18.31070695
  10,2.35619449,-33.23401872,60.27844426,8.503119197,40.29812746,13.09365533,33.23401872,19.9803168
  6,2.775073511,-46.67902132,49.09598592,4.616761337,27.84032975,16.07362188,17.91839748,21.25565617`;
  let points = Papa.parse(input);
  
  for(let i = 1; i < points.data.length; i++)
  {
    const ring = new THREE.Group();
    create_ring(ring, microball, parseInt(points.data[i][0]), parseFloat(points.data[i][1]), parseFloat(points.data[i][2]), parseFloat(points.data[i][3]), parseFloat(points.data[i][4]), parseFloat(points.data[i][5]), parseFloat(points.data[i][6]), parseFloat(points.data[i][7]), parseFloat(points.data[i][8]));
  }

  rings_to_remove.forEach(ring => {
    microball.remove(microball.children[ring - 1])
    // microball.children[ring - 1].opacity = .25;
  });

  traps_to_remove.forEach(row => {
      for(let i = row.length - 1; i > 0; i--)
      {
          microball.children[row[0] - 1].remove(microball.children[row[0] - 1].children[row[i] - 1]);
          // microball.children[row[0] - 1].children[row[i] - 1].opacity = 0;
      }
  });

  scene.add(microball);
}