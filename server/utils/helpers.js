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

function createPasswordResetToken(user) {
  return jsonWebToken.sign({
    m: user.Email,
  }, process.env.JWT_SECRET, {expiresIn: '7d'});
}
function verifyPasswordResetToken(token) {
  try{
    const {m} = jsonWebToken.verify(
      token,
      process.env.JWT_SECRET
    );
    return m
  } catch(e) {}
}

function currency(amount) {
  return String(Number(amount).toFixed(2)).replace('.',',').replace(',00',',-')
}
function localeDate(date) {
  if (typeof(date) === 'string')
    date = new Date(date);
  const days = ['Zondag','Maandag','Dinsdag','Woensdag','Donderdag','Vrijdag','Zaterdag'],
        months = [ "Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December" ];
  
  return [days[date.getDay()], date.getDate(), months[date.getMonth()]].join(' ');
}
function localeTime(date) {
  if (typeof(date) === 'string')
    date = new Date(date);
  
  return [date.getHours(), date.getMinutes()].map(val => (val < 10 ? '0' : '') + val).join(':');
}
module.exports = {
  pick,
  postCode,
  createAuthToken,
  verifyAuthToken,

  createUserActivateToken,
  verifyUserActivateToken,
  
  createPasswordResetToken,
  verifyPasswordResetToken,
  
  currency,
  localeDate,
  localeTime
};
