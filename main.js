import './style.css'
import * as THREE from 'three'

const canvas = document.querySelector('canvas');

// renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas, preserveDrawingBuffer: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000)
camera.position.set(0, 0, 1)

// Scene
const scene = new THREE.Scene()
// Plane img
let plane, texAspect
const imgTex = new THREE.TextureLoader().load( './arte.jpg', ()=>{
  texAspect = imgTex.source.data.naturalWidth/imgTex.source.data.naturalHeight

  // Plane
  plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 32, 32 ),
    new THREE.MeshBasicMaterial({ map: imgTex })
  );
  fitPlaneToScreen()
  scene.add(camera, plane)
  updatePosPointer()
})

function isAroundValue(val, target, gap){
  if ((val + gap) > target && (val - gap) < target) {
      return true
  } else {
      return false
  }
}

function fitPlaneToScreen(){
  let scale
  const viewAspect = window.innerWidth/ window.innerHeight

  if (texAspect > viewAspect) {
    scale = [ texAspect/viewAspect, 1]
  } else {
    scale = [ 1, viewAspect/texAspect]
  }
  plane.scale.set(scale[0], scale[1], 1)
}

window.addEventListener('resize', ()=> {
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  fitPlaneToScreen()
  updatePosPointer()
})

function updatePosPointer(){
  renderer.render(scene, camera)
  // Load image
  const img = new Image();
  img.src = renderer.domElement.toDataURL("image/png");

  // downloadURI(renderer.domElement.toDataURL("image/png"), 'test.png')
  
  img.onload = function() {
    // Create canvas element
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw image on canvas
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Find pixel position based on color
    const targetColor = [255, 8, 164]; // pink color #ff08a4
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (isAroundValue(r, targetColor[0], 30) && isAroundValue(g, targetColor[1], 30) && isAroundValue(b, targetColor[2], 30)) {
        let x = (i / 4) % canvas.width;
        let y = Math.floor(i / 4 / canvas.width);
        // console.log(`Window size: (${window.innerWidth}, ${window.innerHeight})`);
        // console.log(`Window rasio: (${window.innerWidth/window.innerHeight})`);
        // console.log(`Img size: (${img.width}, ${img.height})`);
        // console.log(`Img rasio: (${img.width/img.height})`);
        x = x * (window.innerWidth/img.width)
        y = y * (window.innerHeight/img.height)
        console.log(`Pixel position: (${x}, ${y})`);
        document.querySelector('div#point').style.left = `${x - 10}px`
        document.querySelector('div#point').style.top = `${y - 10}px`
        break;
      }
    }
  };
}

const downloadURI = (uri, name) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}