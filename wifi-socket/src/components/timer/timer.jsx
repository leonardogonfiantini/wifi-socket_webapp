import React, {useState, useEffect} from 'react'

import './timer.scss'
  
import TimerRow from '../TimerRow/TimerRow'

import plusBtn from './images/plus-button.png'
import closeModal from './images/cross.png'
import upBtn from './images/up.png'
import downBtn from './images/down.png'
import dotdot from './images/dotdot.png'

function Timer() {

  function openModalTimer() {
    var modal = document.querySelector('#modal-timer')
    modal.classList.add('active')
  }

  function closeModalTimer() {
    var modal = document.querySelector('#modal-timer')
    modal.classList.remove('active')
  }

  const [hour, setHour] = useState('00')
  const [minute, setMinute] = useState('00')

  function upHour() {
    var hours = parseInt(hour) + 1;
    if (hours <= 9) hours = '0' + hours
    setHour(hours)
  }

  function downHour() {
    if (hour > 0) {
      var hours = parseInt(hour) - 1;
      if (hours <= 9) hours = '0' + hours
      setHour(hours)
    }
  }

  function upMinute() {
    if (minute < 59) {
      var minutes = parseInt(minute) + 1;
      if (minutes <= 9) minutes = '0' + minutes
      setMinute(minutes)
    } else {
      upHour()
      setMinute('00')
    }
  }

  function downMinute() {
    if (minute > 0) {
      var minutes = parseInt(minute) - 1;
      if (minutes <= 9) minutes = '0' + minutes
      setMinute(minutes)
    } else {
      setMinute('59')
    }
  }


  const [timers, setTimers] = useState([])
  const [id, setId] = useState(0)

  function CreateTimer() {
    setTimers(
      [...timers, <TimerRow 
                    key={id} 
                    id={id} 
                    time={hour + ':' + minute} 
                    status={'0'}
                  /> ]
    )
    setId(id + 1)

    const fetchCreate = async() => {

      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({timer: hour + ':' + minute, status: '0'})
      }
    
      const response = await fetch("/api/timer/insert", requestOptions)
      console.log(response)
    }

    fetchCreate()
  }

  const [timerData, setTimerDatas] = useState({})
  const [ready, isready] = useState(false)

  useEffect(() => {

    const fetchData = async() => {
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    
      const response = await fetch("/api/timer/getAll", requestOptions)
      const json = await response.json()

      setTimerDatas(json)
      isready(true)
    }

    fetchData()

  }, [])

  useEffect(() => {

    if (!ready) return
    else {
      let copy = []
      let idp = id
      for (let i = 0; i < timerData.length; i++) {
        copy = [...copy, <TimerRow key={idp} id={idp} time={timerData[i].timer} status={timerData[i].status} />]
        idp++;
      }

      setId(idp)
      setTimers(...timers, copy)

    }
  }, [ready])

  return (
    <div className='timer'>
      <div className="timer-create">
        <img src={plusBtn} onClick={openModalTimer} alt="open modal" />
        <div id="modal-timer" className="modal">
          <div className="modal-content">
            <h2> Create timer </h2>
            <img src={closeModal} id='close-modal-timer' className='close-modal' onClick={closeModalTimer} alt="close modal" />

            <div className="set-timer">
              <div className="hour">
                <img className="up" src={upBtn} onClick={upHour} alt="up arrow hour" />
                <p> {hour} </p>
                <img className="down" src={downBtn} onClick={downHour} alt="down arrow hour" />
              </div>

              <img className="dotdot" src={dotdot} alt="dotdot"/>

              <div className="minutes">
                <img className="up" src={upBtn} onClick={upMinute} alt="up arrow minutes" />
                <p> {minute} </p>
                <img className="down" src={downBtn} onClick={downMinute} alt="down arrow minutes" />
              </div>
            </div>

            <button className='create-button' onClick={CreateTimer}> Create </button>
          </div>
        </div>

      </div>

      <div id="timer-rows" className="timer-rows">
          {timers}
      </div>
    </div>
  )

}

export default Timer