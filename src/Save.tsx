import React, { useState, ChangeEvent, useEffect, useCallback } from 'react'
import { AppState, AppAction } from './AppState'
import axios from 'axios'
import "./styles/Save.css"


const Save: React.FC<SaveProps> = ({ state, dispatch, user }) => {
  const [name, setName] = useState('')
  const [selected, setSelected] = useState(-1)
  const [saved, setSaved] = useState<SavedHarmony[]>([])
  const [info, setInfo] = useState({ error: false, message: '' })
  const userId = user

  const loadSong = useCallback((song:SavedHarmony) => {
    setName(song.name)
    const state = JSON.parse(song.code) as AppState
    dispatch({ type: 'setState', state })
    setInfo({ message: `Loaded song ${song.name}`, error: false })
    setTimeout(() => setInfo({ error: false, message: '' }), 4000)
  }, [dispatch])
  
  const save = () => {
    const song = { name, userId, code: JSON.stringify(state) }
    const others = saved.filter(s => s.name !== name)
    setSaved([ ...others, song ])
    setSelected(others.length)
    axios.post<SavedHarmony>(`/songs`, song)
      .then(() => displayInfo(`Saved song ${name}`, false))
      .catch(error => displayInfo(`Error: ${error.response?.status}`, true ))
  }

  const selectSong = ({target}:ChangeEvent<HTMLSelectElement>) => {
    const index = Number(target.value)
    setSelected(index)
    loadSong(saved[index])
  }

  useEffect(() => {
    axios.get<SavedHarmony[]>(`/songs/${userId}`)
      .then(response => {
        const songs = response.data
        setSaved(songs)
        if(songs.length > 0){
          setSelected(songs.length - 1)
          loadSong(songs[songs.length - 1])
        }
      })
      .catch(error => displayInfo(`Error: ${error.response?.status}`, true ))
  }, [userId, loadSong])

  const displayInfo = (message:string, error:boolean) => {
    setInfo({ message, error })
    if(!error){
      setTimeout(() => setInfo({ error: false, message: '' }), 4000)
    }
  }

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
        {info.message && <span className={ info.error ? "savingError" : "savingInfo" }>
          {info.message}
        </span>}
      </div>
    </div>
  )
}

export default Save

interface SaveProps{
  state: AppState,
  dispatch: React.Dispatch<AppAction>,
  user: string
}

export interface SavedHarmony{
  name: string,
  userId: string,
  code: string
}