import React, { useRef, useEffect } from 'react'
import * as Functions from './StaffFunctions'
import sharpFile from './sharp.png'
import neutralFile from './neutral.png'
import flatFile from './flat.png'


const Staff: React.FC<StaffProps> = ({notes, selected = -1, setSelected = ()=>0, chords = {}, keyTone = 0, height = 50, notesMax = 10}) => {
    const metrics = computeMetrics(height, notesMax, keyTone)
    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(loadImages, [])

    useEffect(() => {
        if(!canvas.current){ return }
        const context = canvas.current.getContext('2d')
        if(!context){ return }
        initializeCanvas(context, metrics, height)
        const computed = computeNotes(notes, chords, keyTone, metrics, context)
        drawNoteHighlight(computed, selected, metrics, context)
        drawLines(metrics, context)
        drawKeySignature(keyTone, metrics, context)
        drawNotes(computed, metrics, context)
    })

    const click = (mouse:React.MouseEvent) => {
        mouse.preventDefault()
        if(!canvas.current){ return }
        const context = canvas.current.getContext('2d')
        if(!context){ return }
        const area = canvas.current.getBoundingClientRect()
        const x = mouse.clientX - area.left
        const computed = computeNotes(notes, chords, keyTone, metrics, context)
        setSelected(findNote(computed, x))
    }

    return <canvas height={height} width={metrics.width} onClick={click} ref={canvas}></canvas>
}

const findNote = (notes: Note[], x: number) => {
    return notes.filter(note => note.startX < x).length - 1
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

const drawNotes = (notes: Note[], metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    const radiusY = metrics.lineGap / 2.4
    const radiusX = radiusY * 1.2
    notes.forEach((note, index) => {
        const lineY = lineYFromPosition(note.position, metrics)
        if(note.accidental !== null){ 
            drawAccidental(note.x, lineY, note.accidental, metrics, canvas) 
        }
        drawExtraLines(note.x, note.position, metrics, canvas)
        canvas.ellipse(note.x, lineY, radiusX, radiusY, 0, 0, 6.3)
        canvas.fill() 
        canvas.beginPath()
        if(note.chord){
            canvas.fillText(note.chord, note.startX, metrics.lineGap)
        }
    })
}

const computeNotes = (notes: number[], chords: Chords, key: number, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    let x = metrics.firstNoteX
    let nextChordX = 0
    const signs = Functions.lineSigns(key)

    return notes.map((note, index) => {
        index > 0 && (x += metrics.noteGap)
        const position = Functions.notePosition(note, key)
        const letter = (position + 7) % 7
        let accidental = null
        const sign = Functions.noteSign(note, key)
        if(sign !== signs[letter]){
            x += metrics.noteGap / 2
            signs[letter] = accidental = sign
        }
        if(chords[index]){
            x = Math.max(x, nextChordX)
            nextChordX = x + canvas.measureText(chords[index]).width + metrics.lineGap / 2
        }
        return {x, startX: x - metrics.lineGap / 2, position, accidental, chord: chords[index]}
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

const initializeCanvas = (canvas: CanvasRenderingContext2D, metrics: Metrics, height: number) => {
    canvas.imageSmoothingEnabled = true
    canvas.imageSmoothingQuality = 'high'  // 2019 only supported in Chrome
    canvas.clearRect(0, 0, metrics.width, height)    
    canvas.font = `bold ${metrics.lineGap}px serif`
}

const lineYFromPosition = (position: number, metrics: Metrics) => 
    metrics.linesY + (10 - position) * metrics.lineGap / 2

const computeMetrics = (height: number, notesMax: number, key: number): Metrics => {
    const sheetHeight = height * 0.45
    const lineGap = sheetHeight / 4
    const linesY = height * 0.2
    const noteGap = sheetHeight * 0.6
    const keySignGap = lineGap * 0.8
    const firstNoteX = lineGap * 3 + keySignGap * Math.abs(Functions.signsInKey[key])
    const width = (notesMax + 0.5) * noteGap + firstNoteX

    return { width, linesY, lineGap, noteGap, firstNoteX, keySignGap }
}

const loadImages = () => {
    sharpImage.src = sharpFile
    neutralImage.src = neutralFile
    flatImage.src = flatFile
}

export default Staff

export type Chords = {[index: number]: string}//Record<number, string>

interface StaffProps{
    notes: number[],
    selected?: number,
    setSelected?: (note:number)=>void,
    chords?: Chords,
    keyTone?: number,
    height?: number,
    notesMax?: number
}

interface Metrics{
    width: number,
    linesY: number,
    lineGap: number,
    noteGap: number,
    firstNoteX: number,
    keySignGap: number
}

interface Note{
    x: number,
    startX: number,
    position: number,
    accidental: number|null,
    chord: string
}

const sharpImage = new Image(), flatImage = new Image(), neutralImage = new Image()