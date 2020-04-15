import React, { useRef, useEffect, useState } from 'react'
import * as Functions from './StaffUtils'
import { loadImages, Note, Metrics, drawStaff } from './StaffGraphics'
import { StaffState } from './StaffState'
import { printChord } from './Chords'


const Staff: React.FC<StaffProps> = ({state, setSelected = ()=>0, height = 50, notesMax = 10}) => {
    const key = Functions.bestKey(state.notes)
    const metrics = computeMetrics(height, notesMax, key)
    const canvas = useRef<HTMLCanvasElement>(null)
    const [ , setUpdate] = useState(0)

    useEffect(() => loadImages(() => setUpdate(1)), [])

    useEffect(() => {
        const context = canvas.current?.getContext('2d')
        if(!context){ return }
        initializeCanvas(context, metrics, height)
        const computed = computeNotes(state, key, metrics, context)
        drawStaff(computed, key, state.selected, metrics, context)
    })

    const click = (mouse:React.MouseEvent) => {
        mouse.preventDefault()
        if(!canvas.current){ return } 
        const context = canvas.current.getContext('2d')
        if(!context){ return }
        const area = canvas.current.getBoundingClientRect()
        const x = mouse.clientX - area.left
        const computed = computeNotes(state, key, metrics, context)
        setSelected(findNote(computed, x))
    }

    return <canvas height={height} width={metrics.width} onClick={click} ref={canvas}></canvas>
}

const findNote = (notes: Note[], x: number) => {
    return notes.filter(note => note.startX < x).length - 1
}

const computeNotes = (state:StaffState, key:number, metrics:Metrics, canvas:CanvasRenderingContext2D) => {
    const { notes, chords } = state
    const { noteGap, lineGap } = metrics
    let x = metrics.firstNoteX
    let nextChordX = 0
    const signs = Functions.lineSigns(key)

    return notes.map((note, index) => {
        index > 0 && (x += noteGap)
        const positionY = Functions.notePosition(note, key)
        const letter = (positionY + 7) % 7
        let accidental = null
        const sign = Functions.noteSign(note, key)
        const chord = chords[index] && printChord(chords[index], key)
        if(sign !== signs[letter]){
            x += noteGap / 2
            signs[letter] = accidental = sign
        }
        if(chord){
            x = Math.max(x, nextChordX)
            nextChordX = x + canvas.measureText(chord).width + lineGap / 2
        }
        return { x, startX: x - lineGap / 2, positionY, accidental, chord }
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

export interface StaffProps{
    state:StaffState,
    setSelected?: (note:number)=>void,
    height?: number,
    notesMax?: number
}

export default Staff