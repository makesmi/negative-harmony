

export const drawKeys = (white: KeyArea[], black: KeyArea[], canvas: CanvasRenderingContext2D) => {
    canvas.strokeStyle = borderColor
    canvas.lineWidth = 2
    drawAreas(white, canvas)
    drawAreas(black, canvas)
}

const drawAreas = (areas: KeyArea[], canvas: CanvasRenderingContext2D) => {
    areas.forEach(area => {
        canvas.fillStyle = area.white ? whiteColor : blackColor
        if(area.pressed){ canvas.fillStyle = pressedColor }
        canvas.fillRect(area.x, area.y, area.width, area.height)
        canvas.rect(area.x, area.y, area.width, area.height)
        canvas.stroke()
        canvas.beginPath()
    })
}

export interface KeyArea{
    key: number,
    x: number,
    y: number,
    width: number,
    height: number,
    white: boolean,
    pressed: boolean
}

const pressedColor = "#FFBBCC"
const whiteColor = "#FFFFFF"
const blackColor = "#333333"
const borderColor = "#303030"
