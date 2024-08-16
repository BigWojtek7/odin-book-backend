const asyncHandler = require('express-async-handler');

const dbRequest = require('../db/queries/requestQueries');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jsonwebtoken = require('jsonwebtoken');
const { jwtDecode } = require('jwt-decode');

exports.requests_received_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const requests = await dbRequest.getRequestsReceived(userId);
  res.json(requests);
});

exports.requests_sent_get = asyncHandler(async (req, res) => {
  const userId = req.params.userid;
  const requests = await dbRequest.getRequestsSent(userId);
  res.json(requests);
});

exports.requests_post = asyncHandler(async (req, res) => {
  const userSenderId = req.params.senderid;
  const userReceiverId = req.params.userid;
  await dbRequest.postRequest(userReceiverId, userSenderId);
  res.json({ success: true, msg: 'Request has been created' });
});

exports.requests_delete = asyncHandler(async (req, res) => {
  const userSenderId = req.params.senderid;
  const userReceiverId = req.params.userid;
  await dbRequest.deleteRequest(userReceiverId, userSenderId);
  res.json({ success: true, msg: 'Request has been deleted' });
});
