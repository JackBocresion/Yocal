import React from 'react';
import { motion, useAnimation, useCycle } from 'framer-motion';
import { useCallback } from 'react';
import { userData } from '../../App';
import { variants } from '../../styles/animations';
import { useEffect } from 'react';
import { useContext } from 'react';
export default function Outgoing (props) {
   const [confirm, cycleConfirm] = useCycle(false, true);
   const user = useContext(userData);
   const controls = useAnimation();
   useEffect(() => {
      controls.start(variants.visible);
   });
   return (
      <motion.div
         className="card bg-indigo text-white friend my-3"
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
                  className="btn px-2 py-0 mr-2 float-right btn-secondary"
               >
                  Take back
               </motion.button>
            ) : (
               <motion.button
                  className="btn px-2 py-0 mr-2 float-right btn-danger"
                  onClick={() =>
                     props
                        .onTakeBack()
                        .then(() =>
                           controls
                              .start(variants.hide)
                              .then(() => user.refresh())
                        )
                  }
               >
                  Are you sure?
               </motion.button>
            )}{' '}
            &nbsp;
            <span>
               &nbsp;Freind request sent to{' '}
               {props.name[0].toUpperCase() + props.name.slice(1)}
            </span>
            <br />
            <br />
         </div>
      </motion.div>
   );
};

