import React from 'react';
import "../styles/progress.scss"
export default function Progress ({ done, size, complete }) {
   return (
       <div className="progress" style={{width:size}}>
         <div
            className="progress-done"
            style={{
               opacity: 1,
               width: `${done/complete*100}%`,
            }}
         ></div>
      </div>
   );
};
