


import * as t from 'three';
import "./style.css"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import { gsap } from 'gsap';

const scene = new t.Scene();
let skyboxImage = "space";
let skybox;
// sizes
const sizes = {
  width:window.innerWidth,
  height:window.innerHeight
}




// add moon image in sphere
const earth = createEarth();
setSkyBox();
scene.add(earth);

//add camera
const camera = new t.PerspectiveCamera(75, sizes.width / sizes.height, 0.1 , 1000);
camera.position.z = 60;
scene.add(camera);

// Create stars
createStars();


//add Canvas
const canvas = document.querySelector('.webgl')

//renderer
const renderer = new t.WebGLRenderer({canvas});
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene,camera);


//Controls
const controls = new OrbitControls(camera,canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;


window.addEventListener('resize',() =>{
  //update Sizez
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  //update camera
  camera.aspect  = (sizes.width / sizes.height)
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height)
})

// Clock for tracking elapsed time
const clock = new t.Clock();

// Moon rotation speed
const moonRotationSpeed = 0.02;

const loop = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Earth rotation
  earth.rotation.y = elapsedTime * 0.1;

  // Update Moon rotation around Earth
  const moon = scene.getObjectByName('moon');
  if (moon) {
    moon.rotation.y += moonRotationSpeed;
  }

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
}
loop()






function createEarth() {
  const loader = new t.TextureLoader();
  const geometry = new t.SphereGeometry(8, 64, 64);
  const earthMaterial = new t.MeshBasicMaterial({ map: loader.load('assets/earth_texture.jpg') });
  const earthMesh = new t.Mesh(geometry, earthMaterial);

  // Add a moon to the Earth
  const moonGeometry = new t.SphereGeometry(3, 64, 64);
  const moonMaterial = new t.MeshBasicMaterial({ map: loader.load('assets/moon2.jpg') });
  const moon = new t.Mesh(moonGeometry, moonMaterial);
  moon.name = 'moon';
  moon.position.x = -20; // Adjust the position relative to the Earth

  earthMesh.add(moon);

  const tl = gsap.timeline({defaults:{duration:1}})
  tl.fromTo(earthMesh.scale,{z:0,x: 0, y:0},{z:1,x: 1, y:1} )
  tl.fromTo("nav",{y:"-100%"},{y:"0%"})
  tl.fromTo(".title",{opacity:0}, {opacity:1})



  return earthMesh;
}
function createStars() {
      var stars = []
  		// The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
      for ( var z= -1000; z < 1000; z+=20 ) {
		
        // Make a sphere (exactly the same as before). 
        var geometry   = new t.SphereGeometry(0.5, 32, 32)
        var material = new t.MeshBasicMaterial( {color: 0xffffff} );
        var sphere = new t.Mesh(geometry, material)
  
        // This time we give the sphere random x and y positions between -500 and 500
        sphere.position.x = Math.random() * 1000 - 500;
        sphere.position.y = Math.random() * 1000 - 500;
  
        // Then set the z position to where it is in the loop (distance of camera)
        sphere.position.z = z;
  
        // scale it up a bit
        sphere.scale.x = sphere.scale.y = 1;
  
        //add the sphere to the scene
        scene.add( sphere );
  
        //finally push it to the stars array 
        stars.push(sphere); 
      }
}
function createPathStrings(filename) {
  const basePath = "assets/skybox2/";
  const baseFilename = basePath + filename;
  const fileType = ".png";
  const sides = ["ft", "bk", "up", "dn", "rt", "lf"];
  const pathStrings = sides.map((side) => {
    return baseFilename + "_" + side + fileType;
  });
  return pathStrings;
}

function createMaterialArray(filename) {
  const skyboxImagepaths = createPathStrings(filename);
  const materialArray = skyboxImagepaths.map((image) => {
    let texture = new t.TextureLoader().load(image);
    return new t.MeshBasicMaterial({ map: texture, side: t.BackSide }); 
  });
  return materialArray;
}

function setSkyBox() {
  const materialArray = createMaterialArray(skyboxImage);
  // let temp = new t.TextureLoader().load("../img/space_stars_bg.jpg");
  // let temp1 = new t.MeshBasicMaterial({ map: temp, side: t.BackSide });
  let skyboxGeo = new t.BoxGeometry(200, 200, 200);
  skybox = new t.Mesh(skyboxGeo, materialArray);
  scene.add(skybox);
}