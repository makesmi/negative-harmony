import React, {useRef, useEffect, useState} from 'react'
import * as Letters from './ToneUtils'
import { drawKeys, KeyArea } from './PianoGraphics'

const Piano: React.FC<PianoProps> = ({ press, keys = 32, first = 'A', height = 100 }) => {
    const firstTone = Letters.getTone(first)
    const metrics = computeMetrics(height, keys, firstTone)
    const canvas = useRef<HTMLCanvasElement>(null)
    const [pressed, setPressed] = useState<number[]>([])

    useEffect(() => drawPiano(firstTone, keys, metrics, canvas.current, pressed))

    const click = (mouse:React.MouseEvent) => {
        mouse.preventDefault()
        if(!canvas.current){ return }
        const area = canvas.current.getBoundingClientRect()
        const x = mouse.clientX - area.left, y = mouse.clientY - area.top
        const areas = computeAreas(firstTone, keys, metrics, [])
        const key = findKey(x, y, areas.black) || findKey(x, y, areas.white)
        if(key !== null){ 
            setPressed([key])
            press(key) 
        }
    }

    const release = (mouse:React.MouseEvent) => {
        mouse.preventDefault()
        setPressed([])
    }

    return <canvas width={metrics.width} height={height} 
        onMouseDown={click} onMouseUp={release} ref={canvas}></canvas>
}

const findKey = (x:number, y:number, areas: KeyArea[]) => {
    const found = areas.find((area: KeyArea) =>
            x >= area.x && y >= area.y && x < area.width + area.x && y < area.height + area.y
        )
    return found ? found.key : null
}

const drawPiano = (first: number, count: number, metrics: Metrics, element: HTMLCanvasElement|null, pressed:number[]) => {
    if(!element){ return }
    const canvas = element.getContext('2d')
    if(!canvas){ return }
    const areas = computeAreas(first, count, metrics, pressed)
    drawKeys(areas.white, areas.black, canvas)
}

const computeAreas = (fisrt: number, count: number, metrics: Metrics, pressed: number[]) => {
    const areas = [...Array(count).keys()]
        .map(k => computeArea(k, fisrt, metrics, pressed))
    const white = areas.filter(a => a.white)
    const black = areas.filter(a => !a.white)
    return {white, black}
}

const computeArea = (key: number, first: number, metrics: Metrics, pressedKeys: number[]):KeyArea => {
    const octave = Math.floor((key + first) / 12)
    const tone = (key + first) % 12
    const keyPosition = keyPositions[tone]
    const white = keyColors[tone] === 1
    const xInOctave = (keyPosition - keyPositions[first]) * metrics.keyWidth
    let x = octave * metrics.octaveWidth + xInOctave
    if(!white){ x += metrics.keyWidth - metrics.blackWidth * blackPositions[tone] }
    const width = white ? metrics.keyWidth : metrics.blackWidth
    const height = white ? metrics.whiteHeight : metrics.blackHeight
    const pressed = pressedKeys.find(k => k === key) !== undefined
    return {key, x, y: 0, width, height, white, pressed}
}

const computeMetrics = (height: number, keys: number, first: number): Metrics => {
    const keyWidth = Math.round(height / 4.3)
    const whiteKeys = Letters.whiteKeysCount(first, keys)
 
    return {
        keyWidth,
        blackWidth: Math.round(keyWidth * 4  / 7),
        whiteHeight: height,
        blackHeight: Math.round(height * 5 / 8),
        octaveWidth: keyWidth * 7,
        width: whiteKeys * keyWidth
    }
}

export default Piano

interface PianoProps {
    press: (tone: number)=>void,
    keys?: number,
    first?: string, 
    height?: number
}

interface Metrics{
    keyWidth: number,
    blackWidth: number,
    octaveWidth: number,
    whiteHeight: number,
    blackHeight: number,
    width: number
}

const keyPositions = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]
const keyColors = [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
const blackPositions = [0, 0.6, 0, 0.4, 0, 0, 0.6, 0, 0.5, 0, 0.4, 0]
