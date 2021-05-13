import { useCycle } from 'framer-motion';
import React, { useState, useContext } from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {userData} from '../App.tsx';
import '../styles/nav.scss';
export default function Navbar() {
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
   const [margin, setMargin] = useState({ margin: '10px' });
   const [month, setMonth] = useState(null);

   useEffect(() => {
      window.addEventListener('scroll', (e) => {
         if (window.scrollY >= 40) {
            setMargin({ margin: '10px 71px' });
         } else {
            setMargin({ margin: '10px' });
         }
      });
   }, []);
   const [expanded, Expand] = useCycle(false, true);
   return (
      <nav
         class="navbar navbar-expand-lg navbar-light bg-transparent pl-2"
         style={margin}
      >
         <span class="navbar-brand" href="#">
            &nbsp;Yocal
         </span>
         <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNavDropdown"
            aria-controls="navbarNavDropdown"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ marginRight: 10 }}
            onClick={() => Expand(true)}
         >
            {/* navbar-toggler-view */}
            {/* {expanded == false ? (
               <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-arrows-angle-expand"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     fill-rule="evenodd"
                     d="M5.828 10.172a.5.5 0 0 0-.707 0l-4.096 4.096V11.5a.5.5 0 0 0-1 0v3.975a.5.5 0 0 0 .5.5H4.5a.5.5 0 0 0 0-1H1.732l4.096-4.096a.5.5 0 0 0 0-.707zm4.344-4.344a.5.5 0 0 0 .707 0l4.096-4.096V4.5a.5.5 0 1 0 1 0V.525a.5.5 0 0 0-.5-.5H11.5a.5.5 0 0 0 0 1h2.768l-4.096 4.096a.5.5 0 0 0 0 .707z"
                  />
               </svg>
            ) : (
               <svg
                  width="1em"
                  height="1em"
                  viewBox="0 0 16 16"
                  class="bi bi-arrows-angle-contract"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
               >
                  <path
                     fill-rule="evenodd"
                     d="M.172 15.828a.5.5 0 0 0 .707 0l4.096-4.096V14.5a.5.5 0 1 0 1 0v-3.975a.5.5 0 0 0-.5-.5H1.5a.5.5 0 0 0 0 1h2.768L.172 15.121a.5.5 0 0 0 0 .707zM15.828.172a.5.5 0 0 0-.707 0l-4.096 4.096V1.5a.5.5 0 1 0-1 0v3.975a.5.5 0 0 0 .5.5H14.5a.5.5 0 0 0 0-1h-2.768L15.828.879a.5.5 0 0 0 0-.707z"
                  />
               </svg>
            )} */}
            <span className="navbar-toggler-icon"></span>
         </button>
         <div class="collapse navbar-collapse" id="navbarNavDropdown">
            <ul class="navbar-nav">
               <li class="nav-item active">
                  <Link class="nav-link" to="/home">
                     Home <span class="sr-only">(current)</span>
                  </Link>
               </li>
               <li class="nav-item">
                  <Link class="nav-link" to="/friends">
                     Friends
                  </Link>
               </li>
               <li class="nav-item">
                  <Link class="nav-link " to="/archive">
                     Archive
                  </Link>
               </li>
               <li class="nav-item dropdown">
                  <Link class="nav-link dropdown-toggle disabled">Create</Link>
               </li>
               {/* <li class="nav-item">
                  <a
                     target="_blank"
                     href="https://i.thatcopy.pw/cat-webp/bvqlvmL.webp"
                  >
                     <img
                        class="nav-link"
                        src="https://i.thatcopy.pw/cat-webp/bvqlvmL.webp"
                        height="40px"
                        // width="30px"
                     />
                  </a>
               </li> */}
            </ul>
         </div>
      </nav>
   );
}
