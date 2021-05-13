import React from 'react';
import '../styles/spinner.scss';
import { useCycle } from 'framer-motion';
import { useEffect } from 'react';
export default function Spinner() {
   const [loadingMSG, CycleMSG] = useCycle(null,'this seems to be taking an awfly long time. you should check your internet connection');
   useEffect(() => {
      setTimeout(() => CycleMSG(), 5000);
   }, []);
   return (
      <>
         <div className="bouncer">
            <div />
            <div />
            <div />
            <div />
         </div>
         <span >{loadingMSG}</span>
      </>
   );
}
