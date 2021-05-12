import React from 'react';
import { AnimatePresence, motion, useCycle, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { variants } from '../../styles/animations';
import { userData } from '../../App';
import { useContext } from 'react';
const Friend = (props) => {
   const [confirm, cycleConfirm] = useCycle(false, true);
   const user = useContext(userData);
   const controls = useAnimation();
   useEffect(() => {
      controls.start(variants.visible);
   }, []);
   return (
      <motion.div
         layout
         variants={variants}
         custom={props.index}
         initial="hidden"
         animate={controls}
         exit={{ opacity: 0 }}
         className="card bg-indigo text-white friend"
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
                  className={
                     'btn px-2 py-0 mr-2 float-right btn-' +
                     (confirm == false ? 'secondary' : 'danger')
                  }
               >
                  Remove
               </motion.button>
            ) : (
               <motion.button
                  onClick={() => {
                     props
                        .onRemove()
                        .then(() =>
                           controls
                              .start(variants.hide)
                              .then(() => user.refresh())
                        );
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  className={'btn px-2 py-0 mr-2 float-right btn-danger'}
               >
                  Are you sure?
               </motion.button>
            )}
            &nbsp;
            <span>
               &nbsp;{props.name[0].toUpperCase() + props.name.slice(1)}
            </span>
            <br />
            <br />
         </div>
      </motion.div>
   );
};
export default Friend;
