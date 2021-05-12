import dotenv from 'dotenv';
dotenv.config();
const express = require('express');
export const app = express();
const cors = require('cors');
import * as crypto from 'crypto';


// const bodyParser = require('body-parser');

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());

//app.use(cors());
//add a cors policy
// app.use(cors());

import { Client as PgClient } from 'pg';
const connection = new PgClient({
   user: 'postgres',
   host: 'localhost',
   database: 'jackbocresion',
   password: '',
   port: 5432,
});
(async () => await connection.connect())();
app.use(cors());

import * as argon2 from 'argon2';

import * as redis from 'redis';
import { connect } from 'http2';
import { emit } from 'process';
import { GuildAuditLogsEntry } from 'discord.js';
const tokenCache = redis.createClient();
tokenCache.on('error', function (error:Error) {
   console.error(error);
});

tokenCache.set('key', 'value', redis.print);
tokenCache.get('key', (err, reply) => console.log(reply, 'f'));

const port = process.env.PORT || 8000;
app.listen(port, () => console.log('listening on port ' + port));



import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer(app);
// const io = new Server(httpServer);
const io = require("socket.io")(httpServer)
httpServer.listen(4000);

interface socketUser {
   uuid?:string
}
io.on('connection', (socket: Socket) => {
   const uuid = (socket.handshake.query as socketUser).uuid;
   socket.join(uuid as string);
   console.log(uuid, 'uuid FLAG ON CLIENT');
   socket.on('requestFriend', async (requested) => {
      console.log('FRIEND REQUEST!!!');
      const user = (
         await connection.query(
            `SELECT * FROM users WHERE username='${requested}'`
         )
      ).rows[0];
      io.to(user.uuid).emit('requested');
      console.log('emmited to user with uuid ', user.uuid);
   });
   //FIX EMMITING AND WEBSOCKET CLIENT IMPLEMENTATION
   socket.on('555', (f) => {
      socket.emit('pong');
   });
});


import { Request, Response, NextFunction } from 'express';

function Authenticate(req: Request, res: Response, next: NextFunction) {
   const authHeader = req.headers['authorization'];
   const token = authHeader && authHeader.split(' ')[1];
   if (token == null) return res.sendStatus(401);

   tokenCache.get(token, async (err, val) => {
      if (err) {
         return res.sendStatus(500);
      }
      if (val === null) {
         return res.sendStatus(400);
      }
      console.log('Authenticated user with UUID:' + val);
      req.user = (
         await connection.query(
            `SELECT username, uuid FROM users WHERE uuid::text='${val}'`
         )
      ).rows[0];
      next();
   });
}
//function Share(req, res, next) {}
export interface Event {
   eventid: string;
   title: string;
   date: string;
   duration: number;
   creator: number;
}

declare global {
   export interface Array<T> {
      mapify(this:Array<T>, key:string): Map<string, T>;
   }
   
   export interface Map<K, V> {
      jsonify(this:Map<K,V>): Array<Array<any>>;
   }
}
import { mapify, jsonify } from './maps';
Array.prototype.mapify = mapify
Map.prototype.jsonify = jsonify
interface event {
   eventid: string,
   title: string,
   date: string,
   duration: string,
   creator:string
}
interface User {
   uuid: string,
   username: string,
   password?:string
}
interface FriendRequest {
   requestid: string,
   requester: string,
   requested: string
}
//check types.d.ts
app.get('/getuser', Authenticate, async (req:Request, res:Response) => {
   const events:Array<event> = (
      await connection.query(
         `SELECT * FROM events WHERE creator='{${req.user?.uuid}}'`
      )
   ).rows;
   const incoming: Array<FriendRequest> = (await connection.query(`SElECT username, uuid FROM requests JOIN users ON requester=uuid WHERE requested='{${req.user?.uuid}}'`)).rows
   const outgoing: Array<FriendRequest> = (await connection.query(`SElECT username, uuid FROM requests JOIN users ON requested=uuid WHERE requester='{${req.user?.uuid}}'`)).rows
   res.json({
      ...req.user,
      events: events.mapify('eventid').jsonify(),
      incoming: incoming.mapify('requester').jsonify(),
      outgoing: outgoing.mapify('requested').jsonify()
   });
});
app.post('/register', async (req:Request, res:Response) => {
   let { username, password } = req.body;
   username = username.trim();
   try {
      //if promises fail, catch block triggers
      const hash = await argon2.hash(password);
      await connection.query(
         `INSERT INTO users(username, password) VALUES('${username}', '${hash}')`
      );
      return res.sendStatus(201);
   } catch (err) {
      console.error(err);
      console.log('error!');
      res.sendStatus(400);
   }
});



app.post('/createevent', Authenticate, async (req: Request, res: Response) => {
   const { date, title, duration, users } = req.body;
   console.log(users)
   try {
      const insertion = (await connection.query(
         `INSERT INTO events(title, date, duration, creator) VALUES('${title}', '${date}', ${duration}, '{${req.user?.uuid}}') RETURNING *`
      )).rows[0]
      await connection.query(`INSERT INTO event_relations(event, user_uuid) VALUES('${insertion.eventid}', '${req.user?.uuid}')`)
      users.forEach( async (username:string) => {
         const user = (await connection.query(
         `SELECT * FROM users WHERE username='${username}'`
         )).rows[0]
         console.log("found user", username, user)
         const i = await connection.query(`INSERT INTO event_relations(event, user_uuid) VALUES('${insertion.eventid}', '${user.uuid}') RETURNING *`)
            console.log(i)
         io.to(user.uuid).emit("invite", {})
         console.log("DONE@!")
      });
      res.json({uid:insertion.eventid})
   } catch (e) {
      console.log('error!', e);
      res.sendStatus(500);
   }
});
const EXP = 864000
app.post('/login', async (req: Request, res: Response) => {
   console.log('post req made for login!');
   const { username, password } = req.body;
   console.log(req.body);
   try {
      const { rows } = await connection.query(
         `SELECT * FROM users WHERE username='${username}';`
      );
      if (rows.length === 0) {
         throw 404;
      }
      const user = rows[0];
      if (argon2.verify(user.password, password)) {
         console.log('verified!');
         crypto.randomBytes(48, function (err, buffer) {
            var token = buffer.toString('hex');
            tokenCache.setex(
               token,
               EXP,
               user.uuid,
               (err, result) => {
                  if (err) {
                     throw err;
                  }
                  // console.log(token)
                  res.json({ token: token });
               }
            );
         });
      } else {
         console.log('not verified!');
      }
   } catch (e) {
      console.log(e);
   }
});
app.post('/delete/:eid', Authenticate, async (req: Request, res: Response) => {
   const { eid } = req.params;
   try {
      await connection.query(`DELETE FROM events WHERE eventid='{${eid}}'`);
      res.sendStatus(200);
   } catch (e) {
      console.log('PANIC ON DELETE');
      console.error(e);
      res.sendStatus(500);
   }
});

app.post('/editevent', Authenticate, async (req: Request, res: Response) => {
   const { date, title, duration, eventid } = req.body;
   try {
      await connection.query(`UPDATE events SET title='${title}', date='${date}', duration='${duration}' WHERE eventid='${eventid}'`);
      res.sendStatus(200);
   } catch (e) {
      console.log("error!", e)
      res.sendStatus(500);
   }
});

app.post('/adduser', Authenticate, async (req: Request, res: Response) => {
   let { requested } = req.body
   try {
      const requestedUserRows = (await connection.query(`SELECT username, uuid FROM users WHERE username='${requested}'`)).rows
      if (requestedUserRows.length === 0) { throw 404 }
      const requestedUser = requestedUserRows[0];
      console.log(requestedUser.uuid, 'requestedUser.uuid');
      if ((await connection.query(`SELECT * FROM requests WHERE requester='{${req.user?.uuid}}' AND requested='{${requestedUser.uuid}}'`)).rows[0]) throw (403)

      await connection.query(`INSERT INTO requests(requester, requested) VALUES('{${req.user?.uuid}}','{${requestedUser.uuid}}')`)
      io.to(requestedUser.uuid).emit('requested', req.user)
      res.json({ requestedUser })
   } catch (e) {
      console.error(e)
      if (e === 403) return res.sendStatus(403)
      if(e===404) return res.sendStatus(404)
      res.sendStatus(500)
   }
})
setInterval(() => {
   io.emit("f", "g")
   // console.log("emmitted!!")

}, 2000)