import { useState } from 'react'
import { Chords } from './Staff'
import { mapChord, negativeChord } from './ChordFunctions'

export default (defaultHarmony: StaffHarmony) => {
  const [notes, setNotes] = useState<number[]>(defaultHarmony.notes)
  const [key, setKey] = useState<number>(defaultHarmony.key)
  const [selected, setSelected] = useState<number>(-1)
  const [chords, setChords] = useState<Chords>(defaultHarmony.chords)

  const clear = () => {
    setNotes([])
    setKey(0)
    setSelected(-1)
    setChords({})
  }

  const deleteNote = () => {
    const index = notes.length - 1
    const sliced = notes.slice(0, index)
    setNotes(sliced)
    if(chords[index]){
      setChords({...chords, [index]: ''})
    }
    if(selected === index){
      setSelected(-1)
    }
    return sliced
  }

  const incrementKey = (direction:number) => () => {
    const newKey = (key + direction + 12) % 12
    setKey(newKey)
    setChords(mapChords(chords, key, newKey))
    setNotes(notes.map(note => note += direction))
  }

  const noteSelected = () => selected !== -1 && notes[selected] !== undefined

  const setChord = (index:number, text:string) => {
    setChords({...chords, [index]: text})
  }

  return {
    notes, key, selected, chords,
    setNotes, setKey, setSelected, setChords, 
    clear, deleteNote, incrementKey, noteSelected, setChord,
    props: { notes, keyTone: key, selected, chords }
  }
}
  
  
const mapChords = (chords: Chords, fromKey: number, toKey: number) => {
  const result: Chords = {}
  for(let index in chords){
    result[index] = mapChord(chords[index], fromKey, toKey)
  }
  return result
}

export const negateChords = (positive:Chords, key:number, negativeKey:number):Chords => {
  return Object.entries(positive).map(k => parseInt(k[0]))
    .reduce((prev, note) => ({
          ...prev, [note]: negativeChord(positive[note], key, negativeKey)
      }), {})
}

export interface StaffHarmony{
  notes: number[],
  chords: Chords,
  key: number
}