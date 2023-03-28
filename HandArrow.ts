const arrow = `<svg width="189" height="28" viewBox="0 0 189 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path class="arrowPath" d="M186.552 13.0476C183.395 14.578 176.813 11.4147 173.536 10.8446C161.083 8.67857 148.891 5.07046 136.299 3.86499C104.331 0.804556 77.0762 0.818443 45.5019 7.54108C32.4156 10.3273 19.8494 14.4426 7.63385 19.9613C-0.118164 23.4634 2.1998 20.7693 7.91718 22.4791C10.3782 23.2152 16.4144 26.2493 18.6405 25.8325C22.072 25.19 10.9297 27.174 8.2005 24.997C5.56722 22.8964 0.0117608 26.2239 3.21701 21.3213C5.56295 17.733 5.59224 10.6885 7.01252 6.59618" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>`


export default class HandArrow {
    private arrowContainer : HTMLElement
    private arrow : SVGSVGElement
    private text : HTMLElement
    private windowSize : object
    private targetPoint : vector2
    private angle : number

    constructor( targetPoint: vector2, text: string, angle: number){
        this.windowSize = {x: window.innerWidth, y: window.innerHeight}
        this.targetPoint = targetPoint
        this.angle = angle

        this.arrowContainer = document.createElement('div')
        this.arrowContainer.classList.add('HandArrow-container')
        this.arrowContainer.innerHTML = arrow
        this.arrowContainer.style.position = 'absolute'
        this.arrowContainer.style.top = `${targetPoint.y}px`
        this.arrowContainer.style.left = `${targetPoint.x}px`
        this.arrowContainer.style.zIndex = '9999'
        this.arrowContainer.style.pointerEvents = 'none'

        this.text = document.createElement('span')
        this.text.innerHTML = text
        this.text.style.color = 'white'
        this.text.style.position = 'absolute'
        this.text.style.display = 'flex'
        this.text.style.justifyContent = 'center'
        this.text.style.textAlign = 'center'
        this.text.style.width = '100px'
        this.text.style.pointerEvents = 'auto'
        this.text.style.transformOrigin = 'center center'

        this.arrow = this.arrowContainer.querySelector('svg')
        this.arrow.style.position = 'absolute'
        this.arrow.style.transformOrigin = '-25px bottom'
        this.arrow.style.opacity = '0'
        this.arrow.style.strokeDashoffset = '250'
        this.arrow.style.strokeDasharray = '250'
        this.arrow.style.animation = 'animateDash 1.8s cubic-bezier(.6,.01,.39,.98) infinite'

        this.arrowContainer.appendChild(this.text)
        document.body.appendChild(this.arrowContainer)
        this.updatePosArrow()


        window.addEventListener('resize', () => {
            this.windowSize = {x: window.innerWidth, y: window.innerHeight}
        })

        // window.addEventListener('mousemove', (e)=>{
        //     this.angle = e.clientY * 0.5
        //     this.updatePosArrow()
        // })
    }
    
    private updatePosArrow() {
        const radAngle = this.degrees_to_radians(this.angle)
        this.arrow.style.transform = `translate(25px , -100%) rotate(-${this.angle}deg)`
        const textPos = {
            x: (Math.cos(radAngle) * (25 + 189)),
            y: (Math.sin(-radAngle) * (25 + 189))
        }
        if (textPos.x < 0) textPos.x -= 100
        if (textPos.y < 0) textPos.y -= 50
        this.text.style.transform = `translate(${textPos.x}px, ${textPos.y}px)`
    }

    private degrees_to_radians(degrees){
        var pi = Math.PI;
        return degrees * (pi/180);
    }

    public changeTargetPoint(newTarget){
        this.arrowContainer.style.top = `${newTarget.y}px`
        this.arrowContainer.style.left = `${newTarget.x}px`
    }
}