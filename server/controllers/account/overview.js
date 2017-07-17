module.exports = function(req, res, next) {
  const categories = [{
    "IdJobCategory": 1,
    "Name": "Aankomend"
  },{
    "IdJobCategory": 2,
    "Name": "Afgerond"
  },{
    "IdJobCategory": 3,
    "Name": "Geannuleerd"
  }];
  res.render('pages/account/overview', {categories});
};
