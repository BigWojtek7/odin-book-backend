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
  const createRequest = await dbRequest.insertRequest(
    userReceiverId,
    userSenderId
  );
  res.json({
    success: true,
    msg: 'Request has been created',
    data: createRequest,
  });
});

exports.requests_deleteReceived = asyncHandler(async (req, res) => {
  const userReceiverId = req.params.userid;
  const userSenderId = req.params.senderid;

  console.log('Attempting to delete request:', {
    userReceiverId,
    userSenderId,
  });
  await dbRequest.deleteReceivedRequest(userReceiverId, userSenderId);
  res.json({
    success: true,
    msg: 'Received request has been deleted',
  });
});

exports.requests_deleteSent = asyncHandler(async (req, res) => {
  const userSenderId = req.params.userid;
  const userReceiverId = req.params.receiverid;

  console.log('Attempting to delete sent request:', {
    userSenderId,
    userReceiverId,
  });

  await dbRequest.deleteSentRequest(userSenderId, userReceiverId);

  res.json({
    success: true,
    msg: 'Sent request has been deleted',
  });
});
