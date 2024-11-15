const asyncHandler = require('express-async-handler');

const dbRequest = require('../db/queries/requestQueries');

exports.requests_received_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const requests = await dbRequest.getRequestsReceived(userId);
  res.json({ success: true, requests: requests });
});

exports.requests_sent_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const requests = await dbRequest.getRequestsSent(userId);
  res.json({ success: true, requests: requests });
});

exports.requests_post = asyncHandler(async (req, res) => {
  const userSenderId = req.params.senderid;
  const userReceiverId = req.params.userid;
  await dbRequest.insertRequest(userReceiverId, userSenderId);
  res.json({ success: true, msg: 'Request has been created' });
});

exports.requests_delete = asyncHandler(async (req, res) => {
  const userSenderId = req.params.senderid;
  const userReceiverId = req.params.userid;
  await dbRequest.deleteRequest(userReceiverId, userSenderId);
  res.json({ success: true, msg: 'Request has been deleted' });
});
