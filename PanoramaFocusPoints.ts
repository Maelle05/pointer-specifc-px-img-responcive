import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import HandArrow from './HandArrow';

export default class PanoramaFocusPoints {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.OrthographicCamera;
    private controls: OrbitControls;
    private scene: THREE.Scene;
    private sphere: THREE.Mesh;
    private rayCaster: THREE.Raycaster;
    private imgTex: THREE.Texture;
    private DOMElements: Array<{ position: THREE.Vector3, element: HTMLElement}>;
    private posPoints: Array<object>;
  
    constructor(canvas: HTMLCanvasElement, imgURL: string, DOMElements: Array<{ position: THREE.Vector3, element: HTMLElement, arrow: HandArrow}> ) {
      this.DOMElements = DOMElements

      this.posPoints = []
  
      this.canvas = canvas
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, preserveDrawingBuffer: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
      this.camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1100 )
      this.camera.target = new THREE.Vector3( 0, 0, 0 );
      this.camera.position.set( 0, 0, 10 );
  
      this.scene = new THREE.Scene()
  
      this.imgTex = new THREE.TextureLoader().load(imgURL, () => {
        this.sphere = new THREE.Mesh(
          new THREE.SphereGeometry( 500, 60, 40 ).scale( - 1, 1, 1 ),
          new THREE.MeshBasicMaterial({ map: this.imgTex })
        );
        this.scene.add(this.camera, this.sphere)
      })
  
      window.addEventListener('resize', () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
      })

      this.controls = new OrbitControls( this.camera, this.canvas )
      this.controls.enableZoom = false
      
      this.tick()


      // DEBUG
      this.rayCaster = new THREE.Raycaster()
      // window.addEventListener('click', (e) => this.pointPositioning(e))
    }

    private tick(){
      this.DOMElements.forEach((el, index) => this.updatePosPoint(el, index))
      
      this.controls.update();
      this.renderer.render(this.scene, this.camera)
      window.requestAnimationFrame(() => this.tick())
    }

    private updatePosPoint(point, id){
      const screenPosition = point.position.clone()
      screenPosition.project(this.camera)

      const translateX = window.innerWidth/2 + (screenPosition.x * window.innerWidth) * 0.5
      const translateY = window.innerHeight/2 - (screenPosition.y * window.innerHeight) * 0.5

      if (screenPosition.z < 1) {
        point.element.style.display = 'block'
        point.element.style.left = `${translateX}px`
        point.element.style.top = `${translateY}px`
        this.posPoints[id] = { x: translateX, y: translateY}
      } else {
        point.element.style.display = 'none'
        this.posPoints[id] = { x: -100000, y: -100000}
      }

      if (point.arrow) {
        point.arrow.changeTargetPoint(this.posPoints[id])
      }
    }

    public getPosPoints(){
      return this.posPoints
    }

    private pointPositioning(e){
      // On convertit la position de la souris dans le repère de la caméra 
      let mouse = new THREE.Vector2(
        (e.clientX / window.innerWidth) * 2 - 1,
        -(e.clientY / window.innerHeight) * 2 + 1
      )
      this.rayCaster.setFromCamera(mouse, this.camera)
      let intersects = this.rayCaster.intersectObject(this.sphere)
      if (intersects.length > 0) {
        console.log('Sphère touchée au point : ', intersects[0].point)
      }
    }
}