import React, {useState, useEffect, useCallback} from 'react'

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
                  /> ]
    )
    setId(id + 1)
  }


  useEffect(() => {
      
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }
    
      var datas = []

      fetch("/api/timer/getAll", requestOptions)
      .then(res => res.json())
      .then(data => data.forEach(e => {
        datas.push(e)
      }))

      let copy = []
      let idp = id;
      
      for(let i = 0; i < datas.length; i++) {
        copy.push(<TimerRow key={idp} id={idp} time={datas[i].timer} />)
        idp++
      }

      console.log(copy)

      setId(idp)

      setTimers(
        [...timers, ...copy]
      )
  }, [])

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