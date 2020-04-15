
export const normal = ["C", "C#", "D", "Eb", "E", "F", "F#", "G", "Ab", "A", "Bb", "H"]
export const sharp = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "H"]
export const flat = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "H"]

export const getTone = (letter: string) => {
    const tone = sharp.indexOf(letter)
    return tone >= 0 ? tone : flat.indexOf(letter)
}

export const normalize = (tone:number) => (tone + 1200) % 12

export const randomLetter = () => {
    const tone = randomTone()
    return Math.random() > 0.5 ? sharp[tone] : flat[tone]
}

export const randomTone = () => Math.floor(Math.random() * 12.0)

export const whiteKeysCount = (first: number, keys: number) => 
    [...Array(keys).keys()]
    .map(k => (k + first) % 12)
    .map(k => normal[k])
    .filter(l => l.length === 1)
    .length
    
export const transposeTone = (tone:number, amount:number) => {
    return normalize(tone + amount)
}

export const negateNote = (note: number, fromKey: number, toKey: number) => {
    return fromKey + toKey - note + 4
}

export const negativeMelody = (notes: number[], fromKey: number, toKey: number) => {
    const increment = (fromKey + toKey < 5) ? 12 : 0
    return notes.map(note => fromKey + toKey - note + 4 + increment)
}
