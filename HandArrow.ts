

const arrow = `<svg width="189" height="28" viewBox="0 0 189 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path class="arrowPath" d="M186.552 13.0476C183.395 14.578 176.813 11.4147 173.536 10.8446C161.083 8.67857 148.891 5.07046 136.299 3.86499C104.331 0.804556 77.0762 0.818443 45.5019 7.54108C32.4156 10.3273 19.8494 14.4426 7.63385 19.9613C-0.118164 23.4634 2.1998 20.7693 7.91718 22.4791C10.3782 23.2152 16.4144 26.2493 18.6405 25.8325C22.072 25.19 10.9297 27.174 8.2005 24.997C5.56722 22.8964 0.0117608 26.2239 3.21701 21.3213C5.56295 17.733 5.59224 10.6885 7.01252 6.59618" stroke="white" stroke-width="3" stroke-linecap="round"/>
</svg>`


export default class HandArrow {
    private arrowContainer : HTMLElement
    private arrow : SVGSVGElement
    private text : HTMLElement
    private windowSize : object
    private targetPoint : object
    private angle : number

    constructor( targetPoint: object, text: string, angle: number){
        this.windowSize = {x: window.innerWidth, y: window.innerHeight}
        this.targetPoint = targetPoint
        this.angle = angle

        this.arrowContainer = document.createElement('div')
        this.arrowContainer.innerHTML = arrow
        this.arrowContainer.style.position = 'absolute'
        this.arrowContainer.style.top = `${targetPoint.y}px`
        this.arrowContainer.style.left = `${targetPoint.x}px`
        this.arrowContainer.style.zIndex = '9999'
        // this.arrowContainer.style.pointerEvents = 'none'

        this.text = document.createElement('span')
        this.text.innerHTML = text
        this.text.style.color = 'white'
        this.text.style.display = 'flex'
        this.text.style.justifyContent = 'center'
        this.text.style.textAlign = 'center'

        this.arrow = this.arrowContainer.querySelector('svg')

        this.arrowContainer.appendChild(this.text)
        document.body.appendChild(this.arrowContainer)
        this.updatePosArrow()


        window.addEventListener('resize', () => {
            this.windowSize = {x: window.innerWidth, y: window.innerHeight}
            this.updatePosArrow()
        })

        // window.addEventListener('mousemove', (e)=>{
        //     this.targetPoint = { x: e.clientX, y: e.clientY }
        //     this.arrowContainer.style.top = `${this.targetPoint.y}px`
        //     this.arrowContainer.style.left = `${this.targetPoint.x}px`
        //     this.updatePosArrow()
        // })
    }

    private updatePosArrow() {
        const distToTop = this.targetPoint.y
        const distToLeft = this.targetPoint.x
        const distToRight = this.windowSize.x - this.targetPoint.x
        const distToBottom = this.windowSize.y - this.targetPoint.y

        if(distToTop > distToBottom && distToLeft > distToRight){
            // Between rotate(-90deg) et rotate(-180deg)
            this.arrowContainer.style.transform = `translateY(-${this.arrowContainer.offsetHeight/2}px)`
            this.arrow.style.transformOrigin = 'left bottom'
            const radAngle = this.angle * ( 180 / Math.PI )
            this.text.style.transform = `translate(${(Math.sin(radAngle) * 189)}px, ${(Math.cos(radAngle) * 189) - this.text.offsetHeight}px)`
            this.angle+=90
            this.arrow.style.transform = `rotate(-${this.angle}deg) translate(10px, -10px)`
        } else if(distToTop > distToBottom && distToLeft < distToRight){
            // Between rotate(0deg) et rotate(-90deg)
            this.arrowContainer.style.transform = `translate(15px, -50px) rotate(-70deg) scaleY(-1)`
            this.text.style.transform = `rotate(110deg) translateY(10px) scaleX(-1)`
        } else if(distToTop < distToBottom && distToLeft > distToRight){
            // Between rotate(180deg) et rotate(90deg)
            this.arrowContainer.style.transform = `translate(-20px, 0px) rotate(120deg)`
            this.text.style.transform = `rotate(240deg) translateY(10px)`
        } else {
            // Between rotate(90deg) et rotate(0deg)
            this.arrowContainer.style.transform = `translate(20px, 0px) rotate(70deg) scaleY(-1)`
            this.text.style.transform = `rotate(250deg) translateY(10px) scaleX(-1)`
        }

    }
}