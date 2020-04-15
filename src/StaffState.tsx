import { Chords, Chord, mapChords, transposeChord } from "./Chords";

export type StaffState = {
    notes: number[],
    chords: Chords,
    key: number,
    selected: number
}

export const DO_NOTHING:StaffAction = { type: 'none' }
export const NONE_SELECTED = -1

export const reduceStaff = (staff:StaffState, action:StaffAction):StaffState => {
    switch(action.type){
        case 'addNote':
            return { ...staff, notes: [...staff.notes, action.note] }
        case 'deleteNote':{
            const last = staff.notes.length - 1
            const notes = staff.notes.slice(0, last)
            const { [last]: deleted, ...chords } = staff.chords
            const selected = staff.selected === last ? NONE_SELECTED : staff.selected
            return { ...staff, notes, chords, selected }
        }
        case 'setChord':{
            const chords = { ...staff.chords, [action.note]: action.chord }
            return { ...staff, chords }
        }
        case 'deleteChord':
            const { [action.note]: deleted, ...chords } = staff.chords
            return { ...staff, chords }
        case 'transpose':
            return { 
                ...staff,
                key: staff.key + action.direction,
                notes: staff.notes.map(n => n + action.direction),
                chords: mapChords(staff.chords, chord => transposeChord(chord, action.direction))
            }
        case 'clear':
            return { ...staff, notes: [], chords: {}, selected: NONE_SELECTED }
        case 'select':
            const selected = action.staff === staff ? action.note : NONE_SELECTED
            return { ...staff, selected }
        default:
            return staff
    }
}

export type StaffAction =
    | { type: 'addNote', note: number }
    | { type: 'deleteNote' }
    | { type: 'none' }
    | { type: 'setChord', note: number, chord: Chord }
    | { type: 'deleteChord', note: number }
    | { type: 'transpose', direction: number }
    | { type: 'clear' }
    | { type: 'select', note: number, staff:StaffState }
