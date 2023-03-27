import './style.css'
import ImageFocusPoints from './ImageFocusPoints'
import HandArrow from './HandArrow'

const imgFocus = new ImageFocusPoints(document.querySelector('canvas'), './arte.jpg', [255, 8, 164], [document.querySelector('.Pointer#p1'),document.querySelector('.Pointer#p2')])

setTimeout(()=>{
    new HandArrow(imgFocus.getPosPoints()[0], 'coucou <br> ceci est un <br> test', 30)
}, 100)