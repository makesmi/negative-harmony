import { useState } from 'react'
import { Chords } from './Staff'
import { mapChord } from './ChordFunctions'

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
    setNotes(notes.slice(0, index))
    if(chords[index]){
      setChords({...chords, [index]: ''})
    }
    if(selected === index){
      setSelected(-1)
    }
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

export interface StaffHarmony{
  notes: number[],
  chords: Chords,
  key: number
}