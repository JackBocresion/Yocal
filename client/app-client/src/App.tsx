// import input from '@material-ui/core/input';
// import './App.css';

import Navbar from './components/Nav';
import React, { useEffect, useState, createContext, useContext } from 'react';
import './styles/calendar.scss';
import './styles/App.css';
import Login from './components/Login';
import Home from './components/Home';
//import Home from './components/newhome';
import {
   BrowserRouter as Router,
   Route,
   Switch,
   Redirect,
   useLocation,
   useHistory,
} from 'react-router-dom';
import Createevent from './components/CreateEvent';
import './styles/Event.scss';
import axios from 'axios';
import FriendMenu from './components/FriendMenu';
import BetaFooter from './components/BetaFooter';
import Edit from './components/Edit';
import './styles/toruskit.css';
import Spinner from './microComponents/spinner';
import Archive from './components/Archive';
import { valify } from './maps';

import Notification from './microComponents/notification';
import io from 'socket.io-client';
import { useCycle } from 'framer-motion';
Map.prototype.valify = valify;
// import Conflicts from "./components/Conflicts"
//use via props vs via a freq called func becasue it will give better performance!

interface User {
   username: string,
   uuid: string,
   events: Array<Event>,
   incoming: Array<FriendRequest>,
   outgoing:Array<FriendRequest>
   
}
export interface Event {
   eventid: string;
   title: string;
   date: string;
   duration: number;
   creator: number;
}
interface FriendRequest {
   requestid: string,
   requester: string,
   requested: string
}
export const userData = createContext<User>(null);
export let socket = io()
const App = () => {
   //create a function here that will create the props data. if it cannot find the data for the prop, redirect and/or return null.
   const [state, setState] = useState({
      username: null,
      data: null,
      events: null,
      friendEvents: null,
      /*--------------------*/
      friendReqs: null,
      friends: null,
      /*--------------------*/
      month: null,
      year: null,
      /* ------------------ */
      chats: null,
      messages: null,
   });

   const history = useHistory();
   const location = useLocation();
   //dont allow users to enter without logging in
   useEffect(() => {
      if (location.pathname !== '/' && localStorage.getItem('token') === null) {
         history.push('/');
      }
   });

   useEffect(() => {
      console.log('state updated!');
      console.table(state);
   }, [state]);

   useEffect(() => {
      getData();
   }, []);

   const [connectionStarted, startConnection] = useCycle(false, true);

   useEffect(() => {
      if (connectionStarted) {
         console.log('CONNECTION STARTING');
         socket = io.connect('http://localhost:4000', { query: `uuid=${state.uuid}` });
         socket.on('pong', (m) => {
            console.log('ponged');
         });
         socket.on('requested', (m) => {
            console.log('requested by user', m);
         });
         socket.emit('555', 'f');
         socket.on("f", () => { console.log("hb!") })
         socket.on("invite", (event) => {
            console.log("fasdfasdfasdfsadfasdf")
            console.log(event, " <- INVITED TO EVENT!!")
         })
         console.log(state)
      }
   }, [connectionStarted]);
   return (
      <div>
            <userData.Provider value={[state, setState]}>
               {state.username == null && window.location.pathname != '/' ? (
                  <Spinner />
               ) : (
                  <>
                     {state.username && <Navbar />}

                     <Switch>
                        <Route path="/" exact component={Login} />
                        <Route path="/home" exact component={Home} />
                        <Route
                           exact
                           path="/home/:day/:month/:year"
                           component={Createevent}
                        />
                        <Route exact path="/friends" component={FriendMenu} />
                        <Route exact path="/edit/:id" component={Edit} />
                        <Route exact path="/archive" component={Archive} />
                        <Route render={() => <h1>404 error</h1>} />
                     </Switch>
                     {/* <BetaFooter /> */}
                  </>
               )}
            </userData.Provider>
      </div>
   );
   async function getData() {
      try {
         //auth with token
         const { data } = await axios.get('http://localhost:8000/getuser', {
            headers: {
               Authorization: 'Bearer ' + localStorage.getItem('token'),
            },
         });
         //set userdata
         setState({
            ...data,
            events: new Map(data.events),
            incoming: new Map(data.incoming),
            outgoing: new Map(data.outgoing)
         });

         if (location.pathname === '/') {
            history.push('/home');
         }
         startConnection();
      } catch (e) {
         history.push('/');
         console.error(e);
         console.log('ERROR');
      } finally {
         console.log('getdata called in appjs');
      }
   }
};
export default App;
