import { sharp, flat, transposeTone, normal, normalize } from "./ToneUtils"
import { isSharpKey } from "./StaffUtils"

export type Chord = {
    type: string,
    root: number,
    bass: number
}

export type Chords = { [index:number]:Chord }

export const printChord = (chord:Chord, key:number) => {
    if(chord.type === '?'){ return '?' }
    const bassPart = chord.bass !== chord.root && '/' + getLetter(chord.bass, key)
    return getLetter(chord.root, key) + chord.type + (bassPart || '')
}

export const constructChord = (chord:string) => {
    const match = chord.match(chordRegex)
    if(!match){ return null }
    const [ , letter, type, bassLetter] = match
    const root = findTone(letter)
    if(root === null){ return null }
    const bass = (bassLetter && findTone(bassLetter)) || root
    return { type, root, bass }
}

type ChordMapping = (chord:Chord)=>Chord

export const mapChords = (chords:Chords, mapping:ChordMapping) => {
    return Object.entries(chords).map(k => parseInt(k[0]))
        .reduce((prev, note) => ({ ...prev, [note]: mapping(chords[note]) }), {})
}

export const transposeChord = (chord:Chord, amount:number) => {
    return { 
        ...chord, 
        root: transposeTone(chord.root, amount), 
        bass: transposeTone(chord.bass, amount) 
    }
}

export const negateChord = (chord:Chord, fromKey:number, toKey:number) => {
    const negativeText = negativeChords['C' + chord.type]
    let negative = negativeText && constructChord(negativeText)
    negative = negative || { ...chord, type: '?' }
    const root = (negative.root - chord.root + fromKey + toKey + 21) % 12
    const bass = (negative.bass - chord.root + fromKey + toKey + 21) % 12
    return { ...negative, root, bass }
}

const getLetter = (tone:number, key:number) => {
    key = normalize(key)
    if(key === 0){ return normal[tone] }
    return isSharpKey(key) ? sharp[tone] : flat[tone]
}

const findTone = (letter:string) => {
    letter = capitalizeFirstLetter(letter)
    if(letter === 'B'){ letter = 'H' }
    if(letter === 'Hb'){ letter = 'Bb' }
    let tone = sharp.indexOf(letter)
    if(tone === -1){ tone = flat.indexOf(letter) }
    return tone === -1 ? null : tone
}

const capitalizeFirstLetter = (name:string) => {
    return name.charAt(0).toUpperCase()
        + name.slice(1).toLowerCase()
}

export const chordRegex = /^([a-zA-Z][b#]?)([^/]*\/?)(?:\/(.+))?$/

export const negativeChords: Record<string, string> = {
    'C': 'Cm',
    'Cm': 'C',
    'Cdim': 'C#dim',
    'Caug': 'Haug',
    'C+': 'H+',
    'Csus4': 'Csus2',
    'Csus2': 'Csus4',
    'C7': 'Am7b5',
    'Cm7': 'Am7',
    'Cmaj7': 'Abmaj7',
    'Cdim7': 'Bbdim7',
    'Cm7b5': 'A7',
    'C6': 'Cm/Bb',
    'Cm6': 'C/Bb',
    'Csus47': 'Dsus47',
    'Cadd9': 'Cmadd11',
    'Cmadd9': 'Cadd11',
    'CmMaj7': 'Abmaj7#5',
    'C9': 'F9',
    'Cm9': 'Fmaj9',
    'Cmaj9': 'Fm9',
    'C7b9': 'Am7b5/F#',
    'Cm7b5b9': 'A7/F#',
    'C7#5b9': 'Gadd9#5/F#',
    'C7#5#9': 'EmMaj11',
    'C7b5b9': 'A7b5/F#',
    'C7b5#9': 'A7b5/E',
    'C11': 'Dm11',
    'C13': 'F11-5',
    'C7b5': 'A7b5',
    'Cmaj7#5': 'AbmMaj7',
    'Cmaj7#11': 'Abmaj7/C#',
    'C9add6': 'Cm7/F#',
    'Cm11': 'D11',
    'C6/9': 'Cm7/F'
}
