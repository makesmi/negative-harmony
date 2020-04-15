import React, { useState, ChangeEvent } from 'react'
import { buttonStyle } from './AppStyles'
import { StaffState } from './StaffState'

const Save: React.FC<SaveProps> = ({ positive, setHarmony }) => {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(-1)
  const [saved, setSaved] = useState<SavedHarmony[]>([])

  const save = () => {
    const { notes, chords, key } = positive
    const object = {
      code: JSON.stringify({ notes, chords, key }),
      user: '10000',
      name
    }
    setSaved([ ...saved, object ])
    setSelected(saved.length)
  }
 
  const load = ({target}:ChangeEvent<HTMLSelectElement>) => {
    const index = Number(target.value)
    setSelected(index)
    const object = saved[index]
    const harmony = JSON.parse(object.code) as StaffState
    setHarmony(harmony)
  }

  return (
    <p>
      <input
          placeholder="Name" 
          value={name} 
          onChange={({target}) => setName(target.value)}
      />
      <button style={buttonStyle} onClick={save}>save</button>
      <br />
      <label>saved: </label>
      <select value={selected} onChange={load}>
        { saved.map((harmony, index) => 
          <option key={harmony.name} value={index}>{harmony.name}</option>
        ) }
      </select>
    </p>
  )
}

export default Save

interface SaveProps{
  positive: StaffState,
  setHarmony: (harmony:StaffState)=>void
}

export interface SavedHarmony{
  name: string,
  user: string,
  code: string
}