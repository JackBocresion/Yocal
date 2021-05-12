import React, { useContext, useRef, useState } from 'react';
import { userData } from '../App.tsx';
import { motion, useMotionTemplate } from 'framer-motion';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import Event from '../components/animatedEvent';
import Progress from '../microComponents/progress';
import '../styles/forms.scss';
import { useHistory } from 'react-router-dom';
import { createCalendar, highlightDate } from './functions/calendars'
import "../styles/edit.scss";
import "../styles/calendar.scss"

Date.prototype.getInfo = function () {
   return {
      day: this.getDate(),
      month: this.getMonth(),
      year: this.getFullYear(),
      hour:
         this.getHours() > 12
            ? this.getHours() % 12
            : this.getHours() == 0
            ? 12
            : this.getHours(),
      minute: this.getMinutes(),
      tod: this.getHours() > 12 ? 2 : 1,
      obj: this,
   };
};
//add date changing!!
export default function Edit(props) {
   const history = useHistory();
   const [user, setUser] = useContext(userData);

   const { id } = useParams();

   const [event, setEvent] = useState(user.events.get(id))
   useEffect(() => {
      setEvent(user.events.get(id));
   }, [])
   const [error, setError] = useState('');
   function updateTitle(e) {
      if (e.target.value.length > 40)
         return setError(
            'your event title must be between 4 and 60 characters'
         );
      setEvent({
         ...event,

         title: e.target.value,
         date: event.date,
         duration: event.duration,
      });
   }
   useEffect(() => {
      console.log(event);
   }, [event]);

   return (
      <div className="p-5 edit-flex">
         <div>
            <div className="selectors-flex">
               <select
                  id="hour"
                  className="form-select form-select-sm"
                  style={{ width: '100px', borderRadius: 10 }}
                  name="hour"
                  defaultValue={new Date(event.date).getHours()%12}
                  onChange={(e) => {
                     console.log(parseInt(e.target.value), "dfasdf")
                     setEvent({
                        ...event,
                        title: event.title,
                        date: new Date(new Date(event.date).setHours(parseInt(e.target.value))).toISOString(),
                        duration: event.duration,
                     })
                  }
                  }
               >
                  {[...Array(12).keys()].map((item) => (
                     <option key={item} >
                        {item}
                     </option>
                  ))}
               </select>
               &nbsp;
               <select
                  className="form-select form-select-sm"
                  style={{ width: '100px', borderRadius: 10 }}
                  defaultValue={new Date(event.date).getMinutes()}
                  onChange={(e) =>
                     setEvent({
                        ...event,
                        title: event.title,
                        date: new Date(event.date).setMinutes(parseInt(e.target.value)),
                        duration: event.duration,
                     })
                  }
                  
               >
                  {[...Array(2).keys()].map((item) => (
                     <option key={item} value={5*item}>{'0' + 5 * item}</option>
                  ))}
                  {[...Array(10).keys()].map((item) => (
                     <option key={item++}>{5 * (item + 1)}</option>
                  ))}
               </select>
               &nbsp;
               <select
                  style={{ width: '100px', borderRadius: 10 }}
                  className="form-select form-select-sm"
                  id="tod"
                  name="tod"
                  defaultValue={new Date(event.date).getHours()<13?"AM":"PM"}
                  onChange={(e) =>
                     setEvent({
                        ...event,
                        title: event.title,
                        date: new Date(event.date).setHours(
                           (new Date(event.date).getHours() + 12) % 24
                        ),
                        duration: event.duration,
                     })
                  }
               >
                  <option>AM</option>
                  <option>PM</option>
               </select>
               &nbsp;
               <div style={{ marginTop: '4px' }}>&nbsp;for&nbsp;</div>
               &nbsp;
               <select
                  style={{ width: '130px', borderRadius: 10 }}
                  className="form-select form-select-sm"
                  defaultValue={event.duration}
                  onChange={(e) =>
                     setEvent({
                        ...event,
                        title: event.title,
                        date: event.date,
                        duration: e.target.value,
                     })
                  }
                  value={event.duration}
               >
                  {[...Array(4).keys()].map((i) =>
                     15 * i < 10 ? (
                        <option value={0}>No duration</option>
                     ) : (
                           //set VCALUES TO THE MINUTE UNIT!!!
                           <option value={15 * i}>{15 * i} Minutes</option>
                        )
                  )}
                  <option
                     value={60}
                  >
                     1 Hour
                  </option>
                  {[...Array(5).keys()].map((i) => (
                     <option
                        value={60 * (2 + i)}
                     >
                        {2 + i} Hours
                     </option>
                     //UPLOAD TO DB AS A DATE
                  ))}
                  <option
                     value={9 * 60}
                  >
                     9 Hours
                  </option>
               </select>
            </div>
            <br />
            <div className="float-left">
               <input
                  className="form-control create-event"
                  value={event && event.title}
                  onChange={(e) => updateTitle(e)}
               />
               <Progress done={event.title.length*3/2} />
                           </div>
               <br/>
               <br />
               <motion.button
                  whileHover={{
                     scale: 1.2,
                  }}
                  whileTap={{
                     scale: 0.9,
                  }}
                  className="btn btn-primary"
                  onClick={() =>
                     update(event)
                        .then(() => {
                           console.log('sucess!');
                           user.refresh();
                           history.push('/home');
                        })
                        .catch(() => { })
                  }
               >
                  Confirm edits
               </motion.button>
               <br />
               <motion.button
                  whileHover={{
                     scale: 1.2,
                  }}
                  whileTap={{
                     scale: 0.9,
                  }}
                  className="btn btn-sm btn-danger mt-2"
                  onClick={() => setEvent(user.events.get(id))}
               >
                  Revert changes
               </motion.button>
               <br />
               <br />
               {/* <Link to="/home"> */}
               <motion.button
                  whileHover={{
                     scale: 1.2,
                  }}
                  whileTap={{
                     scale: 0.9,
                  }}
                  className="btn btn-sm btn-secondary"
                  onClick={() => history.goBack()}
               >
                  &#10094; home
               </motion.button>
               {/* </Link> */}
            </div>
         <div className="float-right">
            <ul className="edit-cal days">
               {createCalendar(5, 2020).map((item) => (
                  <li>
                     {item == -1 ? (
                        <span className="wrong">
                           {item == -1 ? '-' : item + 1}
                        </span>
                     ) : (
                           <Link to={`/home/${1 + item}/${5}/${2020}`}>
                              <span
                                 className={highlightDate(item, {
                                    month: 5,
                                    year: 2020,
                                 })}
                              >
                                 {item + 1}
                              </span>
                           </Link>
                        )}
                  </li>
               ))}
            </ul>
         </div>
         {/* <h2>{event && event.date}</h2>
         {new Date(event.date).toString()} */}
      </div>
   );

   async function update(Newevent) {
      const cookie = localStorage.getItem('token');
      const data = {
         duration: Newevent.duration,
         title: Newevent.title,
         date: new Date(Newevent.date).toISOString(),
         eventid: Newevent.eventid,
      };
      try {
         await axios.post(
            `http://localhost:8000/editevent`,
            data,
            {
               headers: { Authorization: `Bearer ${cookie}` },
            }
         );
         user.events.set(Newevent.eventid, {
            ...data, creator: Newevent.creator
         })
         setUser({ ...user, events: user.events })
         history.push("/home")
      } catch (e) {
         console.log("error: " + e)
      }
   }
}
