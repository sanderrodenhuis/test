const jsonWebToken = require('jsonwebtoken');


function pick(o, ...props) {
  return Object.assign({}, ...props.map(prop => ({[prop]: o[prop]})));
}
function postCode(postcode) {
  postcode = String(postcode).replace(/ /g,'').toUpperCase();
  return postcode.substr(0,4) + ' ' + postcode.substr(4,2);
}

function createAuthToken(user) {
  return jsonWebToken.sign(
    pick(user, 'Username','FirstName','LastName','IdUser'),
    process.env.JWT_SECRET,
    {issuer: process.env.JWT_ISSUER}
  );
}
function verifyAuthToken(token) {
  return jsonWebToken.verify(
    token,
    process.env.JWT_SECRET,
    {issuer: process.env.JWT_ISSUER}
  )
}

function createUserActivateToken(user) {
  return jsonWebToken.sign({
    u: user.IdUser,
  }, process.env.JWT_SECRET, {expiresIn: '30d'});
}
function verifyUserActivateToken(token) {
  return jsonWebToken.verify(
    token,
    process.env.JWT_SECRET
  );
}

module.exports = {
  pick,
  postCode,
  createAuthToken,
  verifyAuthToken,
  
  createUserActivateToken,
  verifyUserActivateToken
};
