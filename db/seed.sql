DROP TABLE IF EXISTS users;

CREATE TABLE users(
  id serial primary key,
  name varchar(200),
  email varchar(150),
  hash text,
  admin boolean DEFAULT false
)