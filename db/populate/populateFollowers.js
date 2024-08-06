const { Client } = require('pg');
const { faker } = require('@faker-js/faker');

const userArgs = process.argv.slice(2);
const sqlDB = userArgs[0];
const client = new Client({
  connectionString: sqlDB,
});

async function populatedb() {
  try {
    await client.connect();

    for (let i = 0; i < 80; i += 1) {
      const userId = faker.number.int({ min: 1, max: 20 });
      const followerId = faker.number.int({ min: 1, max: 20 });

      const insertQuery =
        'INSERT INTO followers (user_id, user_follower_id) VALUES ($1, $2)';
      await client.query(insertQuery, [userId, followerId]);
      console.log(`Dodano rekord: ${i + 1}`);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }

  console.log('done');
}

populatedb();
