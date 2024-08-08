const { Client } = require('pg');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');

const userArgs = process.argv.slice(2);
const sqlDB = userArgs[0];
const client = new Client({
  connectionString: sqlDB,
});

async function populatedb() {
  try {
    const hashedPassword = await bcrypt.hash('123', 10);

    await client.connect();

    for (let i = 0; i < 20; i += 1) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email();
      const profession = faker.person.bio();
      const about = faker.lorem.sentences({ min: 2, max: 3 });
      const avatar = faker.image.avatar();
      const username = faker.internet.userName();
      const password = hashedPassword;

      const insertQuery =
        'INSERT INTO users (first_name, last_name, e_mail, profession, about, avatar_url, username, password) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)';
      await client.query(insertQuery, [
        firstName,
        lastName,
        email,
        profession,
        about,
        avatar,
        username,
        password,
      ]);
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
