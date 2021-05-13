import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import Event from './animatedEvent';
import selectedEvent from './selectedEvent';
import {
   AnimatePresence,
   AnimateSharedLayout,
   motion,
   resolveMotionValue,
} from 'framer-motion';
import Friendevent from './Friendevent';
import { userData } from '../App.tsx';
import { useCallback } from 'react';
import { createCalendar, months, highlightDate } from './functions/calendars';
import classNames from 'classnames';
const Home = () => {
   const [user, setUser] = useContext(userData);
   // console.log(user, 'context');
   const [state, setState] = useState({
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
   });

   const upMonth = () => {
      const statee = { ...state };
      if (state.month == 11) {
         statee.year += 1;
         statee.month = 0;
      } else {
         statee.month = (statee.month + 1) % 12;
      }
      console.log(state, 'state');
      setState(statee);
   };
   const downMonth = () => {
      const statee = { ...state };
      if (statee.month == 0) {
         statee.year -= 1;
         statee.month = 11;
      } else {
         statee.month = (statee.month - 1) % 12;
      }

      setState(statee);
   };
   const location = useLocation();

   return (
      <React.Fragment>
         <div className="month">
            <ul>
               <li>
                  <b>{user.username}</b>
               </li>
               <br />
               <li className="prev">
                  <motion.button
                     onClick={() => downMonth()}
                     className="btn btn-secondary month-nav "
                     whileHover={{ scale: 1.1 }}
                     whileTap={{ scale: 0.9 }}
                  >
                     {/* &#10094; */}
                     <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        class="bi bi-caret-left-fill"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                     </svg>
                  </motion.button>
               </li>
               <li className="next">
                  <motion.button
                     onClick={() => upMonth()}
                     className="btn btn-secondary month-nav"
                     whileHover={{ scale: 1.1 }}
                     transition={{}}
                     whileTap={{ scale: 0.9 }}
                  >
                     {/* &#10095; */}
                     <svg
                        width="1em"
                        height="1em"
                        viewBox="0 0 16 16"
                        class="bi bi-caret-right-fill"
                        fill="currentColor"
                        xmlns="http://www.w3.org/2000/svg"
                     >
                        <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                     </svg>
                  </motion.button>
               </li>
               <li style={{ textAlign: 'center' }}>
                  <span id="monthName">{months[state.month]}</span>
                  <br />
                  <span id="yearNum">{state.year}</span>
                  <br />
                  <br />
                  <motion.button
                     className={`lerp-10 btn btn-sm ${state.year != new Date().getFullYear()||state.month != new Date().getMonth()?"btn-primary":"btn-secondary"}`}
                     onClick={() => {
                        setState({
                        year: new Date().getFullYear(),
                        month: new Date().getMonth()
                        })
                        
                     }}
                     disabled={state.year == new Date().getFullYear()&&state.month == new Date().getMonth()}>Today</motion.button>
               </li>
            </ul>
         </div>
         <div className="cal-flex">
            <ul className="weekdays">
               <li>Mo</li>
               <li>Tu</li>
               <li>We</li>
               <li>Th</li>
               <li>Fr</li>
               <li>Sa</li>
               <li>Su</li>
            </ul>
         </div>
         <br />
         <ul className="days">
            {createCalendar(state.month, state.year).map((item) => (
               <li>
                  {item == -1 ? (
                     <span className="wrong">
                        {item == -1 ? '-' : item + 1}
                     </span>
                  ) : (
                     <Link
                           to={`/home/${1 + item}/${state.month}/${state.year}`}
                           state={{day:1+item, month:state.month, year:state.year, }}
                     >
                           <span className={highlightDate(item, state)}>
                           {item + 1}
                        </span>
                     </Link>
                  )}
               </li>
            ))}
         </ul>

         <br />
         <br />
         <AnimateSharedLayout>
            <motion.div
               className="float pt-4"
               initial={{ opacity: 0, y: -100 }}
               animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                     when: 'afterChildren',
                     staggerChildren: 0.4,
                  },
               }}
            >
               {user &&
                  user.events &&
                  user.events
                     .valify()
                     //.filter((i) => new Date(i.date) >= new Date())
                     .map(
                        (item, i) =>
                           item.creator == user.uuid ? (
                              <Event
                                 index={i}
                                 uid={item.eventid}
                                 title={item.title}
                                 date={item.date}
                                 duration={item.duration}
                                 onDelete={() => leaveEvent(item.eventid)}
                              />
                           ) : null
                        // <Friendevent
                        //    uid={item.eventid}
                        //    title={item.title}
                        //    date={item.date}
                        //    duration={item.duration}
                        //    owner={item.username}
                        //    onLeave={() => leaveEvent(item.eventid)}
                        // />
                     )}
            </motion.div>
         </AnimateSharedLayout>
      </React.Fragment>
   );

   const variants = {
      hidden: { opacity: 0 },
      visible: { transition: { staggerChildren: 1, delayChildren: 1 } },
   };

   async function leaveEvent(uid) {
      const cookie = localStorage.getItem('token');
      try {
         await axios.post(
            `http://localhost:8000/delete/${uid}`,
            {},
            { headers: { Authorization: 'Bearer ' + cookie } }
         );

         user.events.del(uid);
      } catch {
         console.log('was not able to delete event!');
      }
   }
};
export default Home;
Map.prototype.del = function (key) {
   this.delete(key);
   return this;
};

// export async function leaveEvent(context, uid) {
//    const cookie = localStorage.getItem('token');
//    try {
//       await axios.post(
//          `http://localhost:8000/delete/${uid}`,
//          {},
//          { headers: { Authorization: 'Bearer ' + cookie } }
//       );

//       context.events.del(uid);

//    } catch {
//       console.log('was not able to delete event!');
//    }
// }
