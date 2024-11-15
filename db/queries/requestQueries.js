const pool = require('../pool');

async function getRequestsReceived(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FOLLOWER_NAME,
      U.ID AS FOLLOWER_ID,
      AVATAR_URL,
          (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS
        WHERE
          USER_ID = u.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      Requests R
      JOIN USERS U ON R.user_sender_id = U.ID
    WHERE
      R.USER_ID = $1;`,
    [userId]
  );
  return rows;
}

async function getRequestsSent(userId) {
  const { rows } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FOLLOWER_NAME,
      U.ID AS FOLLOWER_ID,
      AVATAR_URL,
          (
        SELECT
          COUNT(*)
        FROM
          FOLLOWERS
        WHERE
          USER_ID = u.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM
      Requests R
      JOIN USERS U ON R.user_id = U.ID
    WHERE
      R.USER_SENDER_ID = $1;`,
    [userId]
  );
  return rows;
}

async function insertRequest(userReceiverId, userSenderId) {
  await pool.query(
    'INSERT INTO requests(user_id, user_sender_id) VALUES($1, $2)',
    [userReceiverId, userSenderId]
  );
  const { rows: userDetails } = await pool.query(
    `SELECT
      U.FIRST_NAME || ' ' || U.LAST_NAME AS FOLLOWER_NAME,
      U.ID AS FOLLOWER_ID,
      U.AVATAR_URL,
      (
        SELECT COUNT(*)
        FROM FOLLOWERS
        WHERE USER_ID = U.ID
      ) AS USER_FOLLOWERS_COUNT
    FROM USERS U
    WHERE U.ID = $1;`,
    [userReceiverId]
  );
  return userDetails[0];
}

async function deleteReceivedRequest(userReceiverId, userSenderId) {
  await pool.query(
    'DELETE FROM requests WHERE user_id=$1 AND user_sender_id=$2',
    [userReceiverId, userSenderId]
  );
}

async function deleteSentRequest(userSenderId, userReceiverId) {
  await pool.query(
    'DELETE FROM requests WHERE user_sender_id = $1 AND user_id = $2',
    [userSenderId, userReceiverId]
  );
}

module.exports = {
  getRequestsReceived,
  getRequestsSent,
  insertRequest,
  deleteReceivedRequest,
  deleteSentRequest,
};
