create table users(
    uuid uuid DEFAULT uuid_generate_v4 (),
    username VARCHAR(20) UNIQUE,
    password VARCHAR NOT NULL,

    primary key(uuid)
);

create table events(
  eventid  
  title VARCHAR(40) NOT NULL,
  date VARCHAR(40) NOT NULL,
  duration INT NOT NULL,
  creator UUID,
  foreign key(creator) references users(uuid)
);
--start this later

CREATE TABLE requests(
  requestid uuid DEFAULT uuid_generate_v4 (),
  requester uuid,
  requested uuid,
  message varchar(30),
  foreign key(requester) references users(uuid) on delete cascade,
  foreign key(requested) references users(uuid) on delete cascade,
  primary key(requestid)
)

-- create table events(
--   event_id uuid PRIMARY KEY DEFAULT uuid_generate_v4 (),
--   title VARCHAR(40) NOT NULL,
--   date VARCHAR(40) NOT NULL,
--   duration INT NOT NULL,
--   creator uuid,
--   foreign key(creator) references users(uuid) on delete cascade 
-- );

-- create table event_relations(
--   relationship_id uuid DEFAULT uuid_generate_v4 (), 
--   event_key uuid,
--   user_key uuid, 
--   foreign key(user_key) references users(uuid) on delete cascade, 
--   foreign key(event_key) references events(event_id) on delete cascade
  
-- )

