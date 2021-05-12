import React from 'react';
import { motion, useCycle } from 'framer-motion';
import { useCallback } from 'react';
export default function AddFriend(props) {
   const [added, cycleAdd] = useCycle(false, true);
   return (
      <div
         className={
            added == true
               ? 'card bg-magenta text-white event-friend'
               : 'card bg-teal text-white event-friend '
         }
      >
         <div className="px-1">
            <br />
            {added == false ? (
               <motion.button
                  onClick={() => {
                     cycleAdd();
                     props.onAdd();
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={'btn px-2 py-0 mr-2 float-right btn-secondary'}
               >
                  +
               </motion.button>
            ) : (
               <motion.button
                  onClick={() => {
                     cycleAdd();
                     props.onRemove();
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={'btn px-2 py-0 mr-2 float-right btn-secondary'}
               >
                  -
               </motion.button>
            )}
            &nbsp;
            <span>
               &nbsp;{props.name[0].toUpperCase() + props.name.slice(1)}
            </span>
            <br />
            <br />
         </div>
      </div>
   );
}
