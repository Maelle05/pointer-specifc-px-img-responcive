import './style.css'
import ImageFocusPoints from './ImageFocusPoints'
import HandArrow from './HandArrow'

new ImageFocusPoints(document.querySelector('canvas'), './arte.jpg', [255, 8, 164], [document.querySelector('div#point'),document.querySelector('div#point2')])

new HandArrow({x: 1044.5 , y: 583 }, 'coucou <br> ceci est un <br> test', 30)
