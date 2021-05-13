import React, { useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useCycle } from 'framer-motion';
import { useContext, useState } from 'react';
import { userData } from '../App.tsx';
import { useEffect } from 'react';
import { AnimateSharedLayout } from 'framer-motion';
import AddFreind from './Friends/friendEventCard';
import { forwardRef } from 'react';
import AddFriend from './Friends/friendEventCard';
import Progress from '../microComponents/progress';
import '../styles/create.scss';
import { months } from "./functions/calendars"
import {useHistory} from "react-router-dom"
const variants = {
   hidden: { opacity: 0 },
   visible: { opacity: 1 },
};
const CreateEvent = (props) => {
   const history = useHistory()
   const submitEvent = async (
      date,
      title,
      duration
   ) => {
      try {
         const {data} = await axios
            .post(
               'http://localhost:8000/createevent',
               {
                  date: date,
                  title: title,
                  duration: duration,
                  users:["jack2"]
               },
               {
                  headers: {
                     Authorization: 'Bearer ' + localStorage.getItem('token'),
                  },
               }
            )
         console.log("EVENT RESPONSE", data.uid)
         console.log(data)
         return data.uid
      } catch (e) {
         console.log("ERROR IN cREATING AND RETRIVING UUID", e)
      }
            //history.push("/home")
   };
   const validateOptions = async () => {
      if (title.length < 4 || title.length > 60) {
         return (errors.current.innerHTML =
            'your event name must be between 4 and 60 characters');
      } else if (
         hour.current.value.toLowerCase() == 'hour' ||
         mins.current.value.toLowerCase() == 'minutes' ||
         tod.current.value.toLowerCase() == 'am/pm'
      ) {
         return (errors.current.innerHTML =
            'please enter a valid time for your event');
      }
      const eventDuration = parseInt(duration.current.value);
      const eventDate = new Date(
         `${months[props.match.params.month]} ${props.match.params.day} ${
            props.match.params.year
         } ${parseInt(hour.current.value) + 1}:${mins.current.value} ${
            tod.current.value
         }`
      ).toISOString();
      const uid = await submitEvent(eventDate, title, eventDuration);
      console.log("UID,", uid)
      //make duration date
      setUser({
         ...user,
         events: user.events.set(uid, {
            creator: user.uuid,
            date: eventDate,
            duration: eventDuration,
            eventid: uid,
            title: title,
         }),
      });
      history.push("/home")
   };
   const [user, setUser] = useContext(userData);

   const formatYear = () => {
      const date = new Date();
      if (date.getFullYear() == props.match.params.year) {
         return '';
      } else {
         return props.match.params.year;
      }
   };

   const hour = useRef(),
      mins = useRef(),
      tod = useRef(),
      errors = useRef(),
      duration = useRef();
   const [title, setTitle] = useState('');
   const controls = useAnimation();


   const animations = {
      exit: {
         x: -1000,
         opacity: 0,
         duration: 0.2,
      },
      enter: {
         x: 0,
         opacity: 1,
         duration: 0.2,
      },
   };
   return (
      <>
         <div className="px-5 pt-5">
            <motion.div
               initial={animations.exit}
               animate={controls}
               className="friends mx-5 float-right"
            >
            </motion.div>
            <div className="px-4">
               <h1 id="curdate">
                  Scheduling event for {months[props.match.params.month]}{' '}
                  {props.match.params.day} {formatYear()}
               </h1>
               <div className="selectors-flex">
                  <select
                     id="hour"
                     className="form-select form-select-sm"
                     style={{ width: '100px', borderRadius: 10 }}
                     ref={hour}
                     name="hour"
                  >
                     <option selected disabled>
                        Hour
                     </option>
                     {[...Array(12).keys()].map((item) => (
                        <option value={item} key={item++}>
                           {item}
                        </option>
                     ))}
                  </select>
                  &nbsp;
                  <select
                     ref={mins}
                     className="form-select form-select-sm"
                     style={{ width: '100px', borderRadius: 10 }}
                  >
                     <option selected disabled>
                        Minute
                     </option>
                     {[...Array(2).keys()].map((item) => (
                        <option key={item}>{'0' + 5 * item}</option>
                     ))}
                     {[...Array(10).keys()].map((item) => (
                        <option key={item++}>{5 * (item + 1)}</option>
                     ))}
                  </select>
                  &nbsp;
                  <select
                     style={{ width: '100px', borderRadius: 10 }}
                     className="form-select form-select-sm"
                     ref={tod}
                     id="tod"
                     name="tod"
                  >
                     <option disabled selected>
                        AM/PM
                     </option>
                     <option>AM</option>
                     <option>PM</option>
                  </select>
                  &nbsp;
                  <div style={{ marginTop: '4px' }}>&nbsp;for&nbsp;</div>
                  &nbsp;
                  <select
                     style={{ width: '100px', borderRadius: 10 }}
                     className="form-select form-select-sm"
                     ref={duration}
                     onChange={() => console.log(duration.current.value)}
                  >
                     {[...Array(4).keys()].map((i) =>
                        15 * i < 10 ? (
                           <option value={0}>No duration</option>
                        ) : (
                           //set VCALUES TO THE MINUTE UNIT!!!
                           <option value={15 * i}>{15 * i} Minutes</option>
                        )
                     )}
                     <option selected value={60}>
                        1 Hour
                     </option>
                     {[...Array(5).keys()].map((i) => (
                        <option value={60 * (2 + i)}>{2 + i} Hours</option>
                        //UPLOAD TO DB AS A DATE
                     ))}
                     <option value={9 * 60}>9 Hours</option>
                  </select>
                  <input
                     //onClick={() => showFriends()}
                     type="checkbox"
                     className="form-check-input mt-2 mx-3"
                     //style={{}}
                  />
               </div>
               <br />
               &nbsp;&nbsp;
                  <input
                     onChange={(e) => updateTitle(e)}
                     value={title}
                     className="form-control create-event"
                  />
                  <Progress done={title.length} size={'60%'} complete={40}/>
               <span className="error" ref={errors}></span>
               <br />
               <br />
               <motion.button
                  whileHover={{
                     scale: 1.2,
                  }}
                  whileTap={{
                     scale: 0.9,
                  }}
                  onClick={validateOptions}
                  className="btn btn-primary"
               >
                  Create event
               </motion.button>
               <br />
               <br />
               <Link to="/home">
                  <motion.button
                     whileHover={{
                        scale: 1.2,
                     }}
                     whileTap={{
                        scale: 0.9,
                     }}
                     className="btn btn-sm btn-secondary"
                  >
                     &#10094; home
                  </motion.button>
               </Link>
            </div>
         </div>
         {/* <br/><br/><br/> */}
      </>
   );


   function updateTitle(e) {
      console.log(e.target.value);
      if (e.target.value.length > 40) {return 0}
      setTitle(e.target.value);
   }
};

export default CreateEvent;
