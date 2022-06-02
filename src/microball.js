import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r125/build/three.module.js';
// import * as Papa from 'https://cdnjs.cloudflare.com/ajax/libs/PapaParse/5.3.2/papaparse.js';


function create_ring(ring, scene, ringnum, n, theta, x_pos, ay, az, cy, cz, yshift, ydist)
{
  for(let i = 0; i < n; i++)
  {
      // let i = 1;
      let coordinatesList = [
        new THREE.Vector2(az, ay-yshift),
        new THREE.Vector2(-1*az, ay-yshift),
        new THREE.Vector2(-1*cz,cy-yshift),
        new THREE.Vector2(cz,cy-yshift),
      ];
  
      let shape = new THREE.Shape(coordinatesList);

      const extrudeSettings = {
        steps: 2,
        depth: 0,
        bevelEnabled: false,
      };

      let geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      const material = new THREE.MeshBasicMaterial( { color: "hsl(275, 100%, 48%)" } );
      let trap = new THREE.Mesh(geometry, material);

      if(ringnum > 5)
      {
        trap.geometry.rotateZ(Math.PI);
      }

      trap.geometry.rotateY(Math.PI/2);
      trap.position.y = ydist/2;
      
      trap.rotateX(((2*Math.PI)/n)*i);
      trap.rotateZ(theta);
  
      let matrixZ = new THREE.Matrix4();
      matrixZ.makeRotationZ(theta);
      trap.position.applyMatrix4(matrixZ);

      trap.position.y = yshift - ydist/2;
      trap.position.y = yshift;

      let matrixX = new THREE.Matrix4();
      matrixX.makeRotationX(((2*Math.PI)/n)*i);
      trap.position.applyMatrix4(matrixX);

      trap.position.x = x_pos; //might have to move forward by .5 * ydist * sin(theta)
      ring.add(trap);

      
      //hexagons
      // const xminus = x_pos - .5 * ydist * Math.sin(theta);
      // const xplus = xminus + ydist * Math.sin(theta);

      // const radius1 = Math.sqrt(ay*ay + az*az);
      // const c1_geometry = new THREE.CylinderGeometry(radius1, radius1, 0, n);
      // const material2 = new THREE.MeshBasicMaterial( { color: 0x06FF00 } );
      // const hexagon1 = new THREE.Mesh(c1_geometry, material2);
      // hexagon1.rotation.z = Math.PI/2;
      // hexagon1.position.x = xminus;
      

      // const radius2 = Math.sqrt(cy*cy + cz*cz);
      // const c2_geometry = new THREE.CylinderGeometry(radius2, radius2, 0, n);
      // const material3 = new THREE.MeshBasicMaterial( { color: 0x0600FF } );
      // const hexagon2 = new THREE.Mesh(c2_geometry, material3);
      // hexagon2.rotation.z = Math.PI/2;
      // hexagon2.position.x = xplus;

      // if(ringnum > 5)
      // {
      //   hexagon1.position.x = xplus;
      //   hexagon2.position.x = xminus;
      // }

      // scene.add(hexagon1);
      // scene.add(hexagon2);
  }
  scene.add(ring); //make microball group in future and add rings to microball
}

export function create_microball(scene)
{
  let input =
  `ringnum,n_dets,theta,x_pos,ay,az,cy,cz,y_shift,y_dist
  1,6,0.157079633,110.1512041,26.95002851,15.42279225,7.702522536,4.447053459,17.32627552,19.24750598
  2,10,0.366519143,78.20659823,39.14462469,12.29488884,19.49909494,6.335640006,29.32185982,19.64552974
  3,12,0.628318531,53.49748946,45.31001988,11.27774318,28.44511972,7.621846857,36.8775698,16.86490016
  4,12,0.907571211,36.32045822,49.12834227,11.71656519,35.0742588,9.39811932,42.10130053,14.05408347
  5,14,1.221730476,25.3856653,61.60196015,11.41217372,43.96926208,10.03569714,52.78561111,17.63269807
  6,14,1.570796327,8.82E+00,67.63269807,11.41217372,50,11.41217372,58.81634904,17.63269807
  7,12,1.946042116,-7.974253489,63.53494579,10.31961896,45.22423884,12.11779828,54.37959231,18.31070695
  8,10,2.35619449,-26.16990997,60.27844426,8.503119197,40.29812746,13.09365533,50.28828586,19.9803168
  9,6,2.775073511,-42.87034837,49.09598592,4.616761337,27.84032975,16.07362188,38.46815784,21.25565617`;
  let points = Papa.parse(input);
  // console.log(points);
  
  for(let i = 1; i < points.data.length; i++)
  {
    // let i = 9;
    const ring = new THREE.Group();
    create_ring(ring, scene, points.data[i][0], points.data[i][1], points.data[i][2], points.data[i][3], points.data[i][4], points.data[i][5], points.data[i][6], points.data[i][7], points.data[i][8], points.data[i][9]);
  }
}