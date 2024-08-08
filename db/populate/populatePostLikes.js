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

    for (let i = 0; i < 240; i += 1) {
      const userId = faker.number.int({ min: 1, max: 20 });
      const postsId = faker.number.int({ min: 1, max: 80 });

      const insertQuery =
        'INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) ON CONFLICT (user_id, post_id) DO NOTHING;';
      await client.query(insertQuery, [userId, postsId]);
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
