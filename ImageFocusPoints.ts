import * as THREE from 'three'

export default class ImageFocusPoints {
    private canvas: HTMLCanvasElement;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.OrthographicCamera;
    private scene: THREE.Scene;
    private plane: THREE.Mesh;
    private texAspect: number;
    private imgTex: THREE.Texture;
    private targetColorRGB: Array<[number, number, number]>;
    private DOMElements: Array<HTMLElement>;
    private nbTargets: number;
    private step: number;
    private posPoints: Array<object>;
  
    constructor(canvas: HTMLCanvasElement, imgURL: string, targetColorRGB: Array<[number, number, number]>, DOMElements: Array<HTMLElement> ) {
      this.targetColorRGB = targetColorRGB
      this.nbTargets = DOMElements.length
      this.DOMElements = DOMElements
      this.step = 0
      this.posPoints = []
  
      this.canvas = canvas
      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, preserveDrawingBuffer: true })
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  
      this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, -1000, 1000)
      this.camera.position.set(0, 0, 1)
  
      this.scene = new THREE.Scene()
  
      this.imgTex = new THREE.TextureLoader().load(imgURL, () => {
        this.texAspect = this.imgTex.image.naturalWidth / this.imgTex.image.naturalHeight
  
        this.plane = new THREE.Mesh(
          new THREE.PlaneGeometry(1, 1, 32, 32),
          new THREE.MeshBasicMaterial({ map: this.imgTex })
        );
        this.fitPlaneToScreen()
        this.scene.add(this.camera, this.plane)
        this.updatePosPointer()
      })
  
      window.addEventListener('resize', () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.fitPlaneToScreen()
        this.updatePosPointer()
      })
    }
  
    private isAroundValue(val, target, gap) {
      if ((val + gap) > target && (val - gap) < target) {
        return true
      } else {
        return false
      }
    }
  
    private fitPlaneToScreen() {
      let scale
      const viewAspect = window.innerWidth / window.innerHeight
  
      if (this.texAspect > viewAspect) {
        scale = [this.texAspect / viewAspect, 1]
      } else {
        scale = [1, viewAspect / this.texAspect]
      }
      this.plane.scale.set(scale[0], scale[1], 1)
    }
  
    private updatePosPointer() {
      this.step = 0
      this.posPoints = []
      this.renderer.render(this.scene, this.camera)
      const img = new Image();
      img.src = this.renderer.domElement.toDataURL("image/png");
  
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
  
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
  
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
  
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          if (this.isAroundValue(r, this.targetColorRGB[0], 30) && this.isAroundValue(g, this.targetColorRGB[1], 30) && this.isAroundValue(b, this.targetColorRGB[2], 30)) {
            let x = (i / 4) % canvas.width;
            let y = Math.floor(i / 4 / canvas.width);
  
            x = x * (window.innerWidth / img.width)
            y = y * (window.innerHeight / img.height)
  
            if(this.posPoints.length === 0 || !this.isAroundValue(this.posPoints[this.posPoints.length-1].x, x, 10)){
              this.posPoints.push({ x: x, y: y})
              // console.log(`Pixel position: (${x}, ${y})`);
              this.DOMElements[this.step].style.left = `${x - 10}px`
              this.DOMElements[this.step].style.top = `${y - 10}px`
  
              this.step++
              if (this.step === this.nbTargets) {
                console.log('Pixels positions', this.getPosPoints())
                break;
              }
            }
          }
        }
      };
    }
  
    public getPosPoints(){
      return this.posPoints
    }
}