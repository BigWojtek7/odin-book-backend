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
      const likes = faker.number.int(20);
      const content = faker.lorem.sentences({ min: 5, max: 20 });
      const date = faker.date.past({ years: 5 });

      const insertQuery =
        'INSERT INTO posts (user_id, likes, content, date) VALUES ($1, $2, $3, $4)';
      await client.query(insertQuery, [userId, likes, content, date]);
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
