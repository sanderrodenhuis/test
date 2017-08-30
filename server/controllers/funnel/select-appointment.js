let router = require('express').Router();
let {pick, parseBodyArray} = require('../../utils/helpers');
let {HtmlHandler, JsonHandler, ApplicationError, ValidationError} = require('../../utils/errors');

router.get('/', HtmlHandler( async (req, res) =>{
  let order = res.locals.order = req.session.order = req.session.order || {};
  if (! order.IdJob)
    return res.redirect('/funnel');
  
  try {
    res.locals.job = await req.mendix.fetchJob(order.IdJob);
    if (req.user)
      res.locals.user = await req.mendix.fetchUser(req.user.IdUser);
    
    res.render('pages/funnel/select-appointment');
  } catch(e) {
    console.log(e);
    throw new ApplicationError('Er is iets misgegaan. Probeer het later opnieuw.');
  }
}));

router.post('/', JsonHandler( async (req, res) => {
  let postData = parseBodyArray(req.body);
  let job;
  let order = res.locals.order = req.session.order = req.session.order || {};
  try {
    job = res.locals.job = await req.mendix.fetchJob(order.IdJob);
  } catch(e) {
    throw new ApplicationError('Er is iets misgegaan. Probeer het later opnieuw');
  }
  
  let newOrder = Object.assign({}, order, pick(postData,'HouseNumber','PostCode','Addition','Date','Times','Comments','Photos','IdTimeSlot'));
  if (newOrder.Times)
    newOrder.Times = newOrder.Times.split('|');
  let validation = req.mendix.validators.newOrder(newOrder, 'HouseNumber','PostCode','IdJob','Date','Times');
  
  job.AdditionalQuestions.some(({IdAdditionalQuestion}) => {
    if (! postData.AdditionalQuestions[IdAdditionalQuestion])
    {
      validation = Object.assign({},validation,{
        [`AdditionalQuestions[${IdAdditionalQuestion}]`]: 'U dient de extra informatie in te vullen'
      });
      return true;
    }
  });
  
  if (validation)
    throw new ValidationError('Er is iets misgegaan. Probeer het later opnieuw',validation)

  newOrder.AdditionalQuestions = postData.AdditionalQuestions;
  newOrder.Amount = 1;
  let newAmountQuestion = job.AdditionalQuestions.find(question => question.AnswerType === 'Integer');
  if (newAmountQuestion)
    newOrder.Amount = newOrder.AdditionalQuestions[newAmountQuestion.IdAdditionalQuestion];
  Object.assign(order, newOrder);
  if (order.Photos && ! Array.isArray(order.Photos))
    order.Photos = [order.Photos];

  return true;
}));

module.exports = router;
