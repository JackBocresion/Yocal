import { Link } from 'react-router-dom'
import React, { useContext } from 'react';
import { AnimatePresence, motion, useCycle, useAnimation } from 'framer-motion';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useMemo } from 'react';
import { variants } from '../styles/animations';
import { userData } from "../App.tsx";
import classNames from 'classnames';
//nothing to factor out becasue this component has a parent

Date.prototype.getInfo = function() {
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
      obj: this  
   }
}
function Event(props) {
   const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
   ];
   const [date, setDate] = useState({});
   useEffect(() => {
      const newDate = new Date(props.date);
      setDate({...newDate.getInfo()});
      console.log(props.creator,"creator from props")
   }, [props]);

   function formatTime() {
      const { minute } = date;
      if (minute < 10) {
         return '0' + minute;
      } else {
         return minute;
      }
   }

   function formatColor() {
      const base = 'card mb-3 text-white ';
      const curDate = new Date();
      if (
         date.day == curDate.getDate() &&
         date.month == curDate.getMonth() &&
         date.year == curDate.getFullYear()
      ) {
         return {
            color: base + 'bg-success',
            verb:'have'
         };
      } else if (curDate < date.obj) {
         return {
            color: base + 'bg-info',
            verb:'have'
         };
      } else {
         return {
            color: base + 'bg-danger',
            verb:'had'
         };
      }
   }

   function formatYear() {
      const curDate = new Date();
      if (curDate.getFullYear() == date.year) {
         return ' ';
      } else {
         return date.year + ' ';
      }
   }

   function formatTOD() {
      if (date.tod == 1) return 'AM';
      if (date.tod == 2) return 'PM';
   }
   function formatDay() {
      if (date.day == new Date().toString().split(' ')[2]) {
         return 'Today!';
      }
      return `On ${months[date.month]} ${date.day} `;
   }
   // const [msg, setMsg] = useState('hi');
   function formatDuration() {
      const { duration } = props;
      if (duration == 0) {
         return 'No duration';
      } else {
         //const duration = date.obj.setMinutes(date.minute+props.duration) -date.obj
         //console.log(duration,"duration")

         if (duration < 60) return 'For ' + duration + ' minutes ';
         if (duration == 60) return 'For ' + duration / 60 + ' hour ';
         return 'For ' + duration / 60 + ' hours ';
      }
   }
   const [popup, cyclePopup] = useCycle(false, true);
   const [closed, close] = useCycle(false, true);
   useEffect(() => {
      console.log(`closed cycled on component ${props.index}`);
   }, [closed]);
   //1,2,3 cycle
   const controls = useAnimation();
   useEffect(() => {
      controls.start(variants.visible);
   }, []);
   const user = useContext(userData)
   return (
      <span>
         {closed == false ? (
            <motion.div
               className={formatColor().color}
               layout
               variants={variants}
               custom={props.index}
               initial="hidden"
               animate={controls}
            >
               <div>
                  <span className="float-right">
                     {date.hour}:{formatTime()} {formatTOD()}&nbsp;&nbsp;
                  </span>
                  <br />
                  <span className="title">
                     &nbsp; You {formatColor().verb} {props.title}
                  </span>
                  <span className="float-right">
                     {' '}
                     {formatDuration()} &nbsp;
                  </span>
                  <br />
                  {/*use 1,2,3 state */}
                  <span className="float-right">
                     {formatDay()} {formatYear()} &nbsp;
                  </span>
                     <motion.button
                        whileHover={{
                           scale: 1.2,
                        }}
                        whileTap={{ scale: 0.9 }}
                     className={`lerp-4 btn xxs btn-secondary py-0 px-1 ${popup ? "btn-danger" : "btn-secondary"}`}
                     // onFocus={}
                        onClick={() => {
                           if (!popup) {
                           cyclePopup();
                           setTimeout(() => {
                              cyclePopup();
                           }, 2000);
                           } else {
                              close();
                              props.onDelete();
                           }
                           
                        }}
                     >
                        {' '}
                        <span>{popup?"Are you sure?":"x"}</span>{' '}
                     </motion.button>
                  <Link to={`./edit/${props.uid}`}>
                     <motion.button
                        whileTap={{ scale: 0.9 }}
                        className="btn xxs btn-secondary py-0 px-1"
                        whileHover={{
                           scale: 1.2,
                        }}
                     >
                        edit
                     </motion.button>
                  </Link>
               </div>
            </motion.div>
         ) : null}
      </span>
   );
}
export default Event;
