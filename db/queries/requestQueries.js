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
          FOLLOWERS F2
        WHERE
          F2.USER_FOLLOWER_ID = U.ID
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
          FOLLOWERS F2
        WHERE
          F2.USER_FOLLOWER_ID = U.ID
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

async function deleteRequest(userId) {
  await pool.query('DELETE FROM requests WHERE user_id=$1', [userId]);
}

module.exports = {
  getRequestsReceived,
  getRequestsSent,
  deleteRequest
};