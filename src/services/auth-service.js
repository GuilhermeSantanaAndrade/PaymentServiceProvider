"use strict";
import jwt from "jsonwebtoken";

exports.generateToken = async data => {
  return jwt.sign(data, global.SALT_KEY, { expiresIn: "1d" });
};

exports.decodeToken = async token => {
  var data = await jwt.verify(token, global.SALT_KEY);
  return data;
};

exports.authorize = async (req, res, next) => {
  await processAuthorize(req, res, next, false);
};

exports.authorizeOnlyAdmin = async (req, res, next) => {
  await processAuthorize(req, res, next, true);
};

const processAuthorize = async (req, res, next, onlyAdmin) => {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    res.status(401).json({ status: 401, message: "Acesso Restrito." });
  } else {
    jwt.verify(token, global.SALT_KEY, function(error, decoded) {
      if (error) {
        res.status(401).json({ status: 401, message: "Token inválido." });
      } else {
        if (onlyAdmin && !decoded.user_admin) {
          res.status(401).json({ status: 401, message: "Acesso Restrito[2]." });
          return;
        }

        next();
      }
    });
  }
};
