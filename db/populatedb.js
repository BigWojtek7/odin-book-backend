const { Client } = require('pg');

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name VARCHAR ( 255 ),
  last_name VARCHAR ( 255 ),
  e_mail VARCHAR ( 255 ),
  username VARCHAR ( 255 ),
  password VARCHAR ( 255 )
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  likes integer,
  content VARCHAR ( 255 ),
  date TIMESTAMPTZ,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  post_id integer,
  content VARCHAR ( 255 ),
  date TIMESTAMPTZ,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);


CREATE TABLE IF NOT EXISTS followers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  follower integer,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (follower) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  request_sender integer,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (request_sender) REFERENCES users(id)
);
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: mongoDB,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
