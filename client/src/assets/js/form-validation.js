import $ from './jquery';
import IBAN from 'iban'

$.validator.addMethod("regx", function(value, element, regexpr) {
  return regexpr.test(value);
});
$.validator.addMethod("ibanValidation", function(value) {
  return IBAN.isValid(value);
});
$(() => {


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

  $(".disabled-form--account-create").validate({
    rules: {
      FirstName: {
        required: true,
        minlength: 2
      },
      LastName: {
        required: true,
        minlength: 2
      },
      Email: {
        required: true,
        email: true
      },
      PhoneNumber: {
        required: true,
        minlength: 10
      },
      NewPassword: {
        required: true,
        minlength: 6,
      },
      ConfirmPassword: {
        required: true,
        minlength:6,
        equalTo: "#password"
      },
      PostCode: {
        regx: /^(\d{4}\s?[A-Z]{2})$/
      },
      HouseNumber: {
        required: true,
        digits: true
      }

    },
    // validation error messages
    messages: {
      FirstName: "Vul uw voornaam in",
      LastName: "Vul uw achternaam in",
      NewPassword: {
        required: "Vul een wachtwoord in",
        minlength: "Your password must be at least 5 characters long"
      },
      ConfirmPassword: "De wachtwoorden komen niet overeen",
      Email: "Dit e-mailadres werd niet herkend",
      PhoneNumber: "Please enter a valid phone number. ex: 0211002233",
      PostCode: 'Please enter a valid postcode. example: 1111AA'
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      $.post(location.href,$(form).serialize())
        .then(result => console.log('done',result))
        .catch(error => console.log('error', error));
    }
  });

  $('#form-iban').validate({
    rules: {
      iban: {
        required: true,
        ibanValidation: true,
      },
      voorwaarden: {
        required: true
      }

    },
    messages: {
      iban: "IBAN is not valid",

    },
    submitHandler: function(form) {
      form.submit();
    }
  })

  $('#form-contact').validate({
    rules: {
      name: {
        required: true,
        minlength: 2
      },
      email: {
        required: true,
        email: true
      },
      message: {
        required: true
      }

    },
    // validation error messages
    messages: {
      name: "Please enter your name",
      email: "Dit e-mailadres werd niet herkend",
      message: "Please leave a message"
    },
    // Make sure the form is submitted to the destination defined
    // in the "action" attribute of the form when valid
    submitHandler: function(form) {
      form.submit();
    }
  })

})


