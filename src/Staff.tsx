import React, { useRef, useEffect } from 'react'
import * as Functions from './StaffFunctions'
import { loadImages, Note, Metrics, drawStaff } from './StaffGraphics'


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
        drawStaff(computed, keyTone, selected, metrics, context)
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

const computeNotes = (notes: number[], chords: Chords, key: number, metrics: Metrics, canvas: CanvasRenderingContext2D) => {
    let x = metrics.firstNoteX
    let nextChordX = 0
    const signs = Functions.lineSigns(key)

    return notes.map((note, index) => {
        index > 0 && (x += metrics.noteGap)
        const positionY = Functions.notePosition(note, key)
        const letter = (positionY + 7) % 7
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
        return {x, startX: x - metrics.lineGap / 2, positionY, accidental, chord: chords[index]}
    })
}


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

const initializeCanvas = (canvas: CanvasRenderingContext2D, metrics: Metrics, height: number) => {
    canvas.imageSmoothingEnabled = true
    canvas.imageSmoothingQuality = 'high'  // 2019 only supported in Chrome
    canvas.clearRect(0, 0, metrics.width, height)    
    canvas.font = `bold ${metrics.lineGap}px serif`
}


export default Staff

export type Chords = {[index: number]: string}

interface StaffProps{
    notes: number[],
    selected?: number,
    setSelected?: (note:number)=>void,
    chords?: Chords,
    keyTone?: number,
    height?: number,
    notesMax?: number
}

