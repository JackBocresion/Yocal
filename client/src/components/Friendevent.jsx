import React, { useEffect, useState } from 'react';
import { motion, useCycle } from 'framer-motion';
import Axios from 'axios';
//nothing to factor out becasue this component has a parent
function Friendevent(props) {
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
      //console.log(newDate,props, "props and date");
      setDate({
         day: newDate.getDate(),
         month: newDate.getMonth(),
         year: newDate.getFullYear(),
         hour:
            newDate.getHours() > 12
               ? newDate.getHours() % 12
               : newDate.getHours() == 0
               ? 12
               : newDate.getHours(),
         minute: newDate.getMinutes(),
         tod: newDate.getHours() > 12 ? 2 : 1,
         obj: newDate,
      });
      // console.log(date);
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
         return base + 'bg-success';
      } else if (curDate < date.obj) {
         return base + 'bg-info';
      } else {
         return base + 'bg-danger';
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
      if (date.day == new Date().getDate()) {
         return 'Today!';
      }
      return `On ${months[date.month]} ${date.day} `;
   }
   function formatDuration() {
      if (props.duration == 0) {
         return 'No duration';
      } else {
         //const duration = date.obj.setMinutes(date.minute+props.duration) -date.obj
         //console.log(duration,"duration")
         const { duration } = props;
         if (duration < 60) return 'For ' + duration + ' minutes';
         if (duration == 60) return 'For ' + duration / 60 + ' hour';
         return 'For ' + duration / 60 + ' hours';
      }
   }
   const [popup, cyclePopup] = useCycle(false, true);
   const [closed, close] = useCycle(false, true);
  const [joined, Join] = useCycle(false, true);
  const variants = {
    hidden: i =>  ({
       opacity: 0 ,
       y:i*25-100
    }),
    visible: i => ({
       opacity: 1,
       y:0,
       transition: {
          delay: i * 0.1,
       },
    }),
 }
   return (
      <span>
         {closed == false ? (
            <motion.div
               variants={variants}
               custom={props.index}
               initial="hidden"
               animate="visible"
               className={formatColor()}
               // whileHover={{ scale: 1.05 }}
            >
               <div>
                  <span className="float-right">
                     {date.hour}:{formatTime()} {formatTOD()} &nbsp;
                  </span>
                  <br />
                  <span className="title">
                     &nbsp;{' '}
                     {props.owner[0].toUpperCase() + props.owner.slice(1)} has
                     invited you to {props.title}
                  </span>
                  <span className="float-right">{formatDuration()} &nbsp;</span>
                  <br />
                  {}
                  <span className="float-right">
                     {formatDay()} {formatYear()}&nbsp;
                  </span>
                  {popup == false ? (
                     <motion.button
                        whileHover={{
                           scale: 1.2,
                        }}
                        className="btn xxs btn-secondary py-0 px-1"
                        onClick={() => {
                           cyclePopup();
                           setTimeout(() => {
                              cyclePopup();
                           }, 2000);
                        }}
                        whileTap={{ scale: 0.9 }}
                     >
                        <span>Leave event</span>{' '}
                     </motion.button>
                  ) : (
                     <motion.button
                        whileHover={{
                           scale: 1.2,
                        }}
                        className="btn xxs btn-danger py-0 px-1"
                        onClick={() => props.onLeave().then(() => close())}
                        whileTap={{ scale: 0.9 }}
                     >
                        Are you sure?
                     </motion.button>
                  )}
                  {joined == false ? (
                     <motion.button
                        whileHover={{
                           scale: 1.2,
                        }}
                        className="btn xxs btn-secondary py-0 px-1"
                        onClick={() => {
                           Join();
                           setTimeout(() => {
                              Join();
                           }, 2000);
                        }}
                        whileTap={{ scale: 0.9 }}
                     >
                        <span>Join</span>{' '}
                     </motion.button>
                  ) : (
                     <motion.button
                        whileHover={{
                           scale: 1.2,
                        }}
                        className="btn xxs btn-success py-0 px-1"
                        onClick={() => props.onJoin()}
                        whileTap={{ scale: 0.9 }}
                     >
                        Are you sure?
                     </motion.button>
                  )}
               </div>
            </motion.div>
         ) : null}
      </span>
   );
}
export default Friendevent;
