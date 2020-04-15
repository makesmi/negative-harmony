import * as Functions from './StaffUtils'
import sharpFile from './sharp.png'
import neutralFile from './neutral.png'
import flatFile from './flat.png'


export const drawStaff = (notes: Note[], key: number, selected: number, metrics: Metrics, context: CanvasRenderingContext2D) => {
    drawNoteHighlight(notes, selected, metrics, context)
    drawLines(metrics, context)
    drawKeySignature(key, metrics, context)
    drawNotes(notes, metrics, context)
}

export const loadImages = (update:()=>void) => {
    const loadImage = (image:HTMLImageElement, file:string) => {
        image.src = file
        image.onload = update
    }
    loadImage(sharpImage, sharpFile)
    loadImage(flatImage, flatFile)
    loadImage(neutralImage, neutralFile)
}

const drawNotes = (notes: Note[], metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const radiusY = metrics.lineGap / 2.4
    const radiusX = radiusY * 1.2
    notes.forEach((note, index) => {
        const lineY = lineYFromPosition(note.positionY, metrics)
        if(note.accidental !== null){ 
            drawAccidental(note.x, lineY, note.accidental, metrics, canvas) 
        }
        drawExtraLines(note.x, note.positionY, metrics, canvas)
        canvas.ellipse(note.x, lineY, radiusX, radiusY, 0, 0, 6.3)
        canvas.fill() 
        canvas.beginPath()
        if(note.chord){
            canvas.fillText(note.chord, note.startX, metrics.lineGap)
        }
    })
}

const drawNoteHighlight = (notes: Note[], selected: number, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const note = notes[selected]
    if(!note){ return }
    const nextNote = notes[selected + 1]
    const nextX = nextNote ? nextNote.startX : note.startX + metrics.noteGap * 2
    const x = note.startX - metrics.lineGap / 4
    canvas.fillStyle = "#FFDDDD"
    canvas.fillRect(x, 0, nextX - note.startX, canvas.canvas.clientHeight)
    canvas.fillStyle = "#000000"
}

const drawLines = (metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    Functions.range(0, 5).forEach(line => {
        const y = metrics.linesY + metrics.lineGap * line
        canvas.rect(0, y, metrics.width, 1)
        canvas.stroke()
        canvas.beginPath()
    })
    canvas.rect(0, metrics.linesY, 1, metrics.lineGap * 4)
    canvas.rect(metrics.width - 1, metrics.linesY, 1, metrics.lineGap * 4)
    canvas.stroke()
    canvas.beginPath()
}

const drawAccidental = (x: number, lineY: number, sign: number, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const image = sign === 1 ? sharpImage : (sign === -1 ? flatImage : neutralImage)
    drawImage(x - metrics.noteGap * 0.7, lineY, image, metrics, canvas)
}

const drawImage = (x: number, lineY: number, image: HTMLImageElement, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const size = metrics.noteGap / 300.0
    const displacement = image === flatImage ? metrics.lineGap*1.9 : metrics.lineGap*1.25
    canvas.drawImage(image, x, lineY - displacement, size * 100, size * 321)
}

const drawExtraLines = (x: number, position: number, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const lines = position > 0 ? Functions.lineRange(12, position) : Functions.lineRange(position, 1)
    lines.forEach(line => {
        const width = metrics.noteGap * 2 / 3
        const y = lineYFromPosition(line, metrics)
        canvas.rect(x - width/2, y, width, 1)
        canvas.stroke()
        canvas.beginPath()
    })
}

const drawKeySignature = (key: number, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const startX = metrics.lineGap
 
    Functions.sharpsInKey(key)
        .map(position => lineYFromPosition(position, metrics))
        .forEach((y, index) => drawImage(startX + index * metrics.keySignGap, y, sharpImage, metrics, canvas))
        
    Functions.flatsInKey(key)
        .map(position => lineYFromPosition(position, metrics))
        .forEach((y, index) => drawImage(startX + index * metrics.keySignGap, y, flatImage, metrics, canvas))
}

const lineYFromPosition = (position: number, metrics: Metrics) => 
    metrics.linesY + (10 - position) * metrics.lineGap / 2

export interface Metrics{
    width: number,
    linesY: number,
    lineGap: number,
    noteGap: number,
    firstNoteX: number,
    keySignGap: number
}

export interface Note{
    x: number,
    startX: number,
    positionY: number,
    accidental: number|null,
    chord: string
}

const sharpImage = new Image(), flatImage = new Image(), neutralImage = new Image()
