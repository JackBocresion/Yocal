import React, { useContext, useEffect, useRef, useState } from 'react';
import { socket, userData } from '../App.tsx';
import axios from 'axios';
import { useCycle, useExternalRef } from 'framer-motion';
import Progress from '../microComponents/progress';
import { motion } from 'framer-motion';
import Outgoing from "./Friends/outgoing"
import Incoming from './Friends/incoming';
export default function FriendMenu() {
   useEffect(() => {
      socket.on('requested', (m) => {
         console.log('requested!');
      });
   });
   const [state, setState] = useContext(userData)
   const [username, setUsername] = useState('');
   useEffect(() => {
      socket.on()
   },[])
   const err = useRef();
   return (
      <div className="m-4">
         <input
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            className="form-control w-25"
         />
         <br />
         <br />
         <b>
            <span ref={err} />
         </b>
         <br />
         <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
            className="btn btn-sm btn-primary"
            onClick={() => requestUser(username)}
         >
            send
         </motion.button>
         {
            state && state.incoming.valify() && state.incoming.valify().map((v, i) =>
               <Outgoing index={i} name={v.username} />
            )
         }
         {
            state && state.outgoing.valify() && state.outgoing.valify().map((v, i) =>
               <Incoming index={i} name={v.username} />
            )
         }
      </div>
   );
   async function requestUser(requested, message) {
      const cookie = localStorage.getItem('token');
      try {
         const {data:user} = await axios.post(
            'http://localhost:8000/adduser',
            { requested, message },
            { headers: { Authorization: 'Bearer ' + cookie } }
         );
         setUsername(user.requestedUser.username+"fasdfsdf")
         console.log('REQUESTED USER!', user);
         // setUsername('');
         Respond(
            err,
            `Sucessfully sent a friend request to: ${requested}`,
            'text-success',
            3000
         );
      } catch (e) {
         console.error(e, 'FAILED TO REQUEST');
         Respond(
            err,
            `Failed to send a friend request to: ${requested}`,
            'text-danger',
            3000
         );
      }
   }
   function Respond(ref, message, className, time) {
      ref.current.classList.toggle(className);
      ref.current.innerHTML = message;
      setTimeout(() => {
         ref.current.innerHTML = '';
         ref.current.classList.toggle(className);
      }, time);
   }
}
