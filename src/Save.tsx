import React, { useState, ChangeEvent, useEffect, useCallback } from 'react'
import { AppState, AppAction } from './AppState'
import axios from 'axios'
import "./styles/Save.css"

const Save: React.FC<SaveProps> = ({ state, dispatch, displayMessage }) => {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(-1)
  const [saved, setSaved] = useState<SavedHarmony[]>([])

  const loadSong = useCallback((song:SavedHarmony) => {
    setName(song.name)
    const state = JSON.parse(song.code) as AppState
    dispatch({ type: 'setState', state })
    displayMessage( `Loaded song ${song.name}`, false)
  }, [dispatch, displayMessage])
  
  const save = () => {
    const song = { name, code: JSON.stringify(state) }
    const others = saved.filter(s => s.name !== name)
    setSaved([ ...others, song ])
    setSelected(others.length)
    axios.post<SavedHarmony>(`/songs`, song)
      .then(() => displayMessage(`Saved song ${name}`, false))
      .catch(error => displayMessage(`Error: ${error.response?.status}`, true ))
  }

  const selectSong = ({target}:ChangeEvent<HTMLSelectElement>) => {
    const index = Number(target.value)
    setSelected(index)
    loadSong(saved[index])
  }

  useEffect(() => {
    axios.get<SavedHarmony[]>(`/songs`)
      .then(response => {
        const songs = response.data
        setSaved(songs)
        if(songs.length > 0){
          setSelected(songs.length - 1)
          loadSong(songs[songs.length - 1])
        }
      })
      .catch(error => displayMessage(`Error: ${error.response?.status}`, true ))
  }, [loadSong, displayMessage])

  return (
    <div>
      <div>
        <input
            placeholder="Song name" 
            value={name} 
            onChange={({target}) => setName(target.value)}
            className="songNameField"
        />
        <button className="button" onClick={save}>save</button>
        <label className="songsLabel">Songs: </label>
        <select value={selected} onChange={selectSong} className="songsSelector">
          { saved.map((harmony, index) => 
            <option key={harmony.name} value={index}>{harmony.name}</option>
          ) }
        </select>
      </div>
    </div>
  )
}

export default Save

interface SaveProps{
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  displayMessage: (message:string, error:boolean)=>void
}

export interface SavedHarmony{
  name: string,
  code: string
}