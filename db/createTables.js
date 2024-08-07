const { Client } = require('pg');

const userArgs = process.argv.slice(2);
const sqlDB = userArgs[0];

const SQL = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  first_name varchar ( 255 ),
  last_name varchar ( 255 ),
  e_mail varchar ( 255 ),
  profession varchar ( 255 ),
  about text,
  avatar_url varchar ( 255 ),
  username varchar ( 255 ),
  password varchar ( 255 )
);

CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  likes integer,
  content text,
  date timestamptz,
  FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  post_id integer,
  likes integer,
  content text,
  date timestamptz,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (post_id) REFERENCES posts(id)
);


CREATE TABLE IF NOT EXISTS followers (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  user_follower_id integer,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_follower_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS requests (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  user_id integer,
  user_sender_id integer,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (user_sender_id) REFERENCES users(id)
);
`;

async function main() {
  console.log('seeding...');
  const client = new Client({
    connectionString: sqlDB,
  });
  await client.connect();
  await client.query(SQL);
  await client.end();
  console.log('done');
}

main();
