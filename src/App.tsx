import React, { useState, ChangeEvent, useRef } from 'react'
import Piano from './Piano'
import Staff, { Chords } from './Staff'
import { bestKey } from './StaffFunctions'
import { negativeChord, negativeMelody } from './ChordFunctions'
import { buttonStyle, hiddenInput, appStyle } from './AppStyles'

const App: React.FC = () => {
  const [notes, setNotes] = useState<number[]>([])
  const [key, setKey] = useState<number>(0)
  const [negativeKey, setNegativeKey] = useState<number>(0)
  const [selected, setSelected] = useState<number>(-1)
  const [selectedNegative, setSelectedNegative] = useState<number>(-1)
  const [chords, setChords] = useState<Chords>({})
  const [negativeChords, setNegativeChords] = useState<Chords>({})
  const [chordText, setChordText] = useState<string>('')
  const input = useRef<HTMLInputElement>(null)
  const negativeNotes = negativeMelody(notes, key, negativeKey)

  const pressKey = (key: number) => {
    const note = key - 3    //first key in the piano is A
    const newNotes = [...notes, note]
    const newKey = bestKey(newNotes)
    setKey(newKey)
    setNegativeKey((newKey + 7) % 12)
    setNotes(newNotes)
  }

  const updateChordText = (event:ChangeEvent<HTMLInputElement>) => {
    const text = event.target.value.substring(0, 8)
    setChordText(text)
    if(selected !== -1 && notes[selected] !== undefined){
      setChords({...chords, [selected]: text})
      const negative = negativeChord(text, key, negativeKey)
      setNegativeChords({...negativeChords, [selected]: negative})
    }else if(selectedNegative !== -1 && notes[selectedNegative] !== undefined){
      setNegativeChords({...negativeChords, [selectedNegative]: text})
      const positive = negativeChord(text, negativeKey, key)
      setChords({...chords, [selectedNegative]: positive})
    }
  }

  const selectNote = (index:number) => {
    setSelected(index)
    setSelectedNegative(-1)
    setChordText(chords[index] || '')
    if(!input.current){ return }
    input.current.focus()
  }

  const selectNegative = (index:number) => {
    setSelectedNegative(index)
    setSelected(-1)
    setChordText(negativeChords[index] || '')
    if(!input.current){ return }
    input.current.focus()
  }

  const clearNotes = () => {
    setNotes([])
    setSelected(-1)
    setChords({})
    setKey(0)
  }

  const keyIncrement = (direction: number) => () =>
      setNegativeKey((negativeKey + direction + 12) % 12)

  return (
    <div style={appStyle}>
      <div>
        <input value={chordText} onChange={updateChordText} ref={input} style={hiddenInput}/>
        <Staff {...{notes, chords, selected}} setSelected={selectNote} 
            keyTone={key} height={120} notesMax={25} />
      </div>
      <div>
        <Piano press={pressKey} height={120} keys={20} />
        <button onClick={clearNotes} style={buttonStyle}>clear</button>
      </div>
      <div>
        <h2>Negative Harmony:</h2>
        <Staff notes={negativeNotes} chords={negativeChords} selected={selectedNegative} setSelected={selectNegative}
            keyTone={negativeKey} height={120} notesMax={25} />
      </div>
      <div>
        <button style={buttonStyle} onClick={keyIncrement(-1)}>-</button>
        <button style={buttonStyle} onClick={keyIncrement(1)}>+</button>
      </div>
    </div>
  )
}


export default App
