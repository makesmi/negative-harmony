import { sharp, flat } from "./ToneLetters";
import { isSharpKey } from "./StaffFunctions";


export const mapChord = (chord: string, fromKey: number, toKey: number) => {
    const parts = breakChord(chord)
    if(!parts){ return '?' }
    const tone = (parts.tone - fromKey + toKey + 12) % 12
    const bass = parts.bass !== null ? (parts.bass - fromKey + toKey + 12) % 12 : null
    const bassPart = bass != null ? '/' + getLetter(bass, toKey) : ''
    return getLetter(tone, toKey) + parts.type + bassPart
}

export const negativeChord = (chord: string, fromKey: number, toKey: number) => {
    if(!chord){ return '' }
    const positive = breakChord(chord)
    if(!positive){ return '?' }
    const negativeChord = negativeChords['C' + positive.type]
    const negative = negativeChord && breakChord(negativeChord)
    if(!negative){ return '?' }
    const tone = (negative.tone - positive.tone + fromKey + toKey + 21) % 12
    const negativeBass = negative.bass !== null && 
        (negative.bass - positive.tone + fromKey + toKey + 21) % 12
    const positiveBass = positive.bass !== null && negativeTone(positive.bass, fromKey, toKey)
    const bass = positiveBass || negativeBass
    const bassPart = bass !== false ? '/' + getLetter(bass, toKey) : ''
    return getLetter(tone, toKey) + negative.type + bassPart
}

const breakChord = (chord: string) => {
    const match = chord.match(chordRegex)
    if(!match){ return null }
    const [group, letter, type, bassLetter] = match
    const tone = findTone(letter)
    if(tone === null){ return null }
    const bass = bassLetter ? findTone(bassLetter) : null
    return { tone, type, bass }
}

const getLetter = (tone: number, key: number) => {
    return isSharpKey(key) ? sharp[tone] : flat[tone]
}

const negativeTone = (tone: number, fromKey: number, toKey: number) => 
    (fromKey + toKey - tone + 28) % 12

const findTone = (letter:string) => {
    let tone = sharp.indexOf(letter)
    if(tone === -1){ tone = flat.indexOf(letter) }
    return tone === -1 ? null : tone
}

export const negativeNote = (note: number, fromKey: number, toKey: number) => {
    const increment = (fromKey + toKey < 5) ? 12 : 0
    return fromKey + toKey - note + 4 + increment
}

export const negativeMelody = (notes: number[], fromKey: number, toKey: number) => {
    const increment = (fromKey + toKey < 5) ? 12 : 0
    return notes.map(note => fromKey + toKey - note + 4 + increment)
}
    

export const chordRegex = /([a-zA-Z][b#]?)([^/]*)(?:\/(.+))?/

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
