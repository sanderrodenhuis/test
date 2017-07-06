import $ from './jquery'
import 'jquery-validation';

$.validator.addMethod("regx", function(value, element, regexpr) {
  return regexpr.test(value);
});


$("#form-contact-details").validate({
  rules: {
    firstname: {
      required: true,
      minlength: 2
    },
    lastname: {
      required: true,
      minlength: 2
    },
    email: {
      required: true,
      // validated by the built-in "email" rule
      email: true
    },
    phonenumber: {
      required: true,
      minlength: 10
    },
    password: {
      required: true,
      minlength: 6,
    },
    password_confirm: {
      required: true,
      minlength:6,
      equalTo: "#password"
    },
    postcode: {
      regx: /^(\d{4}\s?[A-Z]{2})$/
    },
    housenumber: {
      required: true,
      digits: true
    }

  },
  // validation error messages
  messages: {
    firstname: "Please enter your firstname",
    lastname: "Please enter your lastname",
    password: {
      required: "Please provide a password",
      minlength: "Your password must be at least 5 characters long"
    },
    password_confirm: "De wachtwoorden komen niet overeen",
    email: "Dit e-mailadres werd niet herkend",
    phonenumber: "Please enter a valid phone number. ex: 0211002233",
    postcode: 'Please enter a valid postcode. example: 1111AA'
  },
  // Make sure the form is submitted to the destination defined
  // in the "action" attribute of the form when valid
  submitHandler: function(form) {
    form.submit();
  }
});



