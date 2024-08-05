#! /usr/bin/env node


// Example of test db by populate with examples
console.log(
  'This script populates some test posts, comments  to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Comment = require('./models/comment');
const Post = require('./models/post');
const User = require('./models/user');

const comments = [];

const posts = [];

const users = [];

const mongoose = require('mongoose');
mongoose.set('strictQuery', false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log('Debug: About to connect');
  await mongoose.connect(mongoDB);
  console.log('Debug: Should be connected?');
  await createUsers();
  await createPosts();
  await createComments();
  console.log('Debug: Closing mongoose');
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// comment[0] will always be the Fantasy comment, regardless of the order
// in which the elements of promise.all's argument complete.
async function commentCreate(index, content, date, user, post) {
  const comment = new Comment({
    content: content,
    date: date,
    user: user,
    post: post,
  });
  await comment.save();
  comments[index] = comment;
  console.log(`Added comment: ${index}`);
}

async function postCreate(index, title, content, date, user) {
  const postdetail = {
    title: title,
    content: content,
    date: date,
    user: user,
  };
  // if (comment != false) postdetail.comment = comment;

  const post = new Post(postdetail);
  await post.save();
  posts[index] = post;
  console.log(`Added post: ${title}`);
}

async function userCreate(
  index,
  first_name,
  last_name,
  username,
  password,
  is_admin
) {
  const user = new User({
    first_name: first_name,
    last_name: last_name,
    username: username,
    password: password,
    is_admin: is_admin,
  });
  await user.save();
  users[index] = user;
  console.log(`Added user: ${index}`);
}

async function createComments() {
  console.log('Adding comments');
  await Promise.all([
    commentCreate(
      0,
      'Some example funny comment -first one',
      '2023-06-06',
      users[0],
      posts[0]
    ),
    commentCreate(
      1,
      'Some example funny comment second',
      '2024-06-06',
      users[1],
      posts[0]
    ),
    commentCreate(
      2,
      'Some example funny comment -first one',
      '2024-06-06',
      users[2],
      posts[1]
    ),
  ]);
}

async function createPosts() {
  console.log('Adding posts');
  await Promise.all([
    postCreate(
      0,
      'Today computers',
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      '2024-06-15',
      users[1]
    ),
    postCreate(
      1,
      'Tomorrow computers',
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      '2024-06-13',
      users[1]
    ),
    postCreate(
      2,
      'Tomoroow after computers',
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      '2024-06-14',
      users[1]
    ),
    postCreate(
      3,
      'Tomoroow after computers 1000',
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      '2023-06-10',
      users[2]
    ),
  ]);
}

async function createUsers() {
  console.log('Adding posts');
  await Promise.all([
    userCreate(0, 'Tim', 'Austin', 'timek', 'funny', true),
    userCreate(1, 'Michael', 'Austin', 'aren', 'notfunny', false),
    userCreate(2, 'Jack', 'Heghew', 'henek', 'yesplease', false),
  ]);
}
