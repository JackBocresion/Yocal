import React from 'react';
import { useContext } from 'react';
import { userData } from '../App.tsx';
import Event from './animatedEvent';
import Friendevent from './Friendevent';
import axios from 'axios';
// import { leaveEvent } from './Home';
import { AnimateSharedLayout, motion } from 'framer-motion';
export default function Archive() {
   const [user] = useContext(userData);
   return (
      <AnimateSharedLayout>
         <motion.div
            className="float pt-4 mt-5"
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
               user.events.valify().map(
                  (item, index) =>
                     item.creator == user.uuid ? (
                        <Event
                           index={index}
                           title={item.title}
                           date={item.date}
                           duration={item.duration}
                           //onDelete={() => leaveEvent(user, item.eventid)}
                        />
                     ) : null
                  // <Friendevent
                  //    index={index}
                  //    title={item.title}
                  //    date={item.date}
                  //    duration={item.duration}
                  //    owner={item.username}
                  //    onLeave={() => leaveEvent(item.eventid)}
                  // />
               )}
         </motion.div>
      </AnimateSharedLayout>
   );
}
