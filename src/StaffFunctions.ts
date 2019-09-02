
export const lineRange = (a: number, b: number) => range(a, b)
    .filter(i => i % 2 === 0)

export const flatsInKey = (key: number) => range(0, -signsInKey[key])
    .map(flat => (11 + flat * 5) % 12)
    .map(tone => flatNumbers[tone])
    .map(tone => tone > 4 ? tone : tone + 7)

export const sharpsInKey = (key: number) => range(0, signsInKey[key])
    .map(sharp => (5 + sharp * 7) % 12)
    .map(tone => sharpNumbers[tone])
    .map(tone => tone > 4 ? tone : tone + 7)

export const notePosition = (note: number, key: number) => {
    const tone = (note + 12) % 12
    const octave = Math.floor(note / 12)
    const numbers = isSharpKey(key) ? sharpNumbers : flatNumbers
    const number = numbers[tone]
    return octave * 7 + number
}

export const noteSign = (note: number, key: number) => {
    if(blacks[(note + 12) % 12]){
        return isSharpKey(key) ? 1 : -1
    }else{
        return 0
    }
}

export const isSharpKey = (key: number) => signsInKey[key] >= 0

export const lineSigns = (key: number) => {
    const signs = [0, 0, 0, 0, 0, 0, 0]
    flatsInKey(key).forEach(flat => signs[flat % 7] = -1)
    sharpsInKey(key).forEach(sharp => signs[sharp % 7] = 1)
    return signs
}

export const bestKey = (notes: number[]) =>
    range(0, 12).sort((a, b) => {
        const accidentalDifference = accidentalsInKey(notes, a) - accidentalsInKey(notes, b)
        const blackDifference = Math.abs(signsInKey[a]) - Math.abs(signsInKey[b])
        return accidentalDifference || blackDifference
    })[0]

export const range = (a: number, b: number) =>
    [...Array(Math.max(0, b - a)).keys()]
    .map(i => i + a)

const accidentalsInKey = (notes: number[], key: number) =>
    notes.map(note => (24 + note - key) % 12)
    .filter(note => blacks[note])
    .length

export const signsInKey = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5]
export const blacks = [false, true, false, true, false, false, true, false, true, false, true, false]

const sharpNumbers = [0, 0, 1, 1, 2, 3, 3, 4, 4, 5, 5, 6]
const flatNumbers = [0, 1, 1, 2, 2, 3, 4, 4, 5, 5, 6, 6]

