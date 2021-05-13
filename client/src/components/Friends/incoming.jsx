import React from 'react';
import { motion, useAnimation, useCycle } from 'framer-motion';
import { variants } from "../../styles/animations"
import { userData } from '../../App'
import { useContext } from 'react';
import { useEffect } from 'react';
export default function Incoming (props) {
   const user = useContext(userData)
   const controls = useAnimation()
   const [confirm, cycleConfirm] = useCycle(false, true);
   const [deleting, Delete] = useCycle(false, true);
   useEffect(() => {
      controls.start(variants.visible)
   },[])
   return (
      <motion.div
         className="card bg-indigo text-white friend"
         layout
         variants={variants}
         custom={props.index}
         initial="hidden"
         animate={controls}
      >
         <div className="px-1">
            <br />
            {confirm == false ? (
               <motion.button
                  onClick={() => {
                     cycleConfirm();
                     setTimeout(() => {
                        cycleConfirm();
                     }, 2000);
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={'btn px-2 py-0 mr-2 float-right btn-secondary'}
               >
                  Accept
               </motion.button>
            ) : (
               <motion.button
                  onClick={() => props.onAccept().then(() => user.refresh())}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn px-2 py-0 mr-2 float-right btn-success"
               >
                  Are you sure?
               </motion.button>
            )}
            {deleting == false ? (
               <motion.button
                  onClick={() => {
                     Delete();
                     setTimeout(() => {
                        
                        Delete();
                     }, 2000);
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={'btn px-2 py-0 mr-2 float-right btn-secondary'}
               >
                  Remove
               </motion.button>
            ) : (
               <motion.button
                  onClick={() => props.onDecline().then(() => controls.start(variants.hide).then(()=>user.refresh()))}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className="btn px-2 py-0 mr-2 float-right btn-danger"
               >
                  Are you sure?
               </motion.button>
            )}
            &nbsp;
            <span>
               &nbsp;{props.name[0].toUpperCase() + props.name.slice(1)} wants
               to be friends!
            </span>
            <br />
            <br />
         </div>
      </motion.div>
   );
};