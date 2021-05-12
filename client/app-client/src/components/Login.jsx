import React, { useContext, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import '../styles/App.css';
import '../styles/forms.scss';
import { userData } from '../App.tsx';
import { useHistory } from 'react-router-dom';
const Login = (props) => {
   const [state, setState] = useContext(userData);
   const history = useHistory();
   const loginRequest = () => {
      const name = document.getElementById('lusername').value;
      const pw = document.getElementById('lpassword').value;
      //get token
      axios
         .post('http://localhost:8000/login', { username: name, password: pw })
         .then(async (res) => {
            //set token
            localStorage.setItem('token', res.data.token);
            try {
               //auth with token
               const { data } = await axios.get(
                  'http://localhost:8000/getuser',
                  {
                     headers: {
                        Authorization:
                           'Bearer ' + localStorage.getItem('token'),
                     },
                  }
               );
               //set userdata
               setState({
                  ...data,
                  events: new Map(data.events),
               });
               //go to home
               history.push('/home');
            } catch (e) {
               console.error(e);
            }
         })
         .catch((err) => {
            switch (err.response.status) {
               case 401:
                  return (document.getElementById('noo').innerHTML =
                     'incorrect password');
               case 404:
                  return (document.getElementById('noo').innerHTML =
                     'account does not exist, please create one below.');
               default:
                  return;
            }
         });
   };
   const registerRequest = () => {
      const name = document.getElementById('rusername').value;
      const pw = document.getElementById('rpassword').value;
      const pwC = document.getElementById('Cpassword').value;
      if (!name || !pw) {
         return (document.getElementById('noo1').innerHTML =
            'Please enter a username and password');
      }
      if (pw === pwC) {
         axios
            .post('http://localhost:8000/register', {
               username: name,
               password: pw,
            })
            .then((res) => {
               if (res.status == 200) {
                  document.getElementById('noo1').innerHTML =
                     'Account created! You can now login';
               } else {
                  return;
               }
            })
            .catch((err) => {
               switch (err.response.status) {
                  case 400:
                     return (document.getElementById('noo1').innerHTML =
                        'Username in use');
                  case 500:
                     return (document.getElementById('noo1').innerHTML =
                        'Internal server error');
                  default:
                     return (document.getElementById('noo1').innerHTML =
                        'Unknown error');
               }
            });
      } else {
         document.getElementById('noo1').innerHTML = 'passwords do not match';
      }
   };
   return (
      <React.Fragment>
         <div className="align-middle">
            <div className="m-5 ">
               <h1 className="float-left">Login:</h1>
               <br />
               <form className="pl-4 pt-5 px-11 py-3">
                  <label for="username" className="form-label float-left">
                     Username
                  </label>
                  <input
                     type="username"
                     className="form-control "
                     id="lusername"
                     placeholder="username"
                  />
                  <br />
                  <label for="password" className="form-label float-left">
                     Password
                  </label>
                  <input
                     type="password"
                     className="form-control"
                     id="lpassword"
                     placeholder="Password"
                  />
                  <br />
                  <h4 id="noo"></h4>
               </form>
               <motion.button
                  className="btn btn-primary btn-sm float-left"
                  onClick={() => loginRequest()}
                  whileHover={{
                     scale: 1.2,
                  }}
                  whileTap={{
                     scale: 0.9,
                  }}
               >
                  Log in
               </motion.button>
            </div>
            <br />
            <div className="m-5">
               <h1 className="">Alternatively:</h1>
               <br />
               <h2 className="float-left">Register Here:</h2>
               <form
                  className="pl-4 pt-5 px-11 py-3"
                  method="POST"
                  action="/register"
               >
                  <label for="username" className="form-label float-left">
                     Username
                  </label>
                  <input
                     type="username"
                     className="form-control"
                     id="rusername"
                     placeholder="username"
                  />
                  <br />
                  <label for="password" className="form-label float-left">
                     Password
                  </label>
                  <input
                     type="password"
                     className="form-control"
                     id="rpassword"
                     placeholder="Password"
                  />
                  <br />
                  <input
                     type="password"
                     className="form-control"
                     id="Cpassword"
                     placeholder="Confirm Password"
                  />
                  <br />
                  <h4 id="noo1"></h4>
               </form>
               <motion.button
                  whileHover={{
                     scale: 1.2,
                  }}
                  whileTap={{
                     scale: 0.9,
                  }}
                  className="btn btn-primary btn-sm float-left"
                  onClick={() => registerRequest()}
               >
                  Register
               </motion.button>
            </div>
         </div>
      </React.Fragment>
   );
};

export default Login;
