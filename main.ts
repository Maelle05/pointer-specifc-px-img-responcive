import './style.css'
import * as THREE from 'three'
import ImageFocusPoints from './ImageFocusPoints'
import HandArrow from './HandArrow'
import PanoramaFocusPoints from './PanoramaFocusPoints'

// const imgFocus = new ImageFocusPoints(document.querySelector('canvas'), './arte.jpg', [255, 8, 164], [document.querySelector('.Pointer#p1'),document.querySelector('.Pointer#p2')])

// setTimeout(()=>{
//     new HandArrow(imgFocus.getPosPoints()[0], 'coucou <br> ceci est un <br> test', 30)
// }, 100)

new PanoramaFocusPoints(
    document.querySelector('canvas'),
    './360.jpg',
    [
        {
            element : document.querySelector('.Pointer#p1'),
            position: new THREE.Vector3( 0.5317732054597113, 5.1725616166319055, 499.6663880423187 )
        },{
            element : document.querySelector('.Pointer#p2'),
            position: new THREE.Vector3( 361.56787937319723, -31.973578131749214, -342.79565611937784 )
        }
    ]
)