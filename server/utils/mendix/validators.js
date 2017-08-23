const jsValidate = require('validate.js'),
      iban = require('iban'),
      pick = require('../helpers').pick,
      options = {fullMessages:false};


jsValidate.extend(jsValidate.validators.datetime, {
  parse: function(value, options) {
    return new Date(value).valueOf()
  },
  // Input is a unix timestamp
  format: function(value, options) {
    return new Date(value)
  }
});
jsValidate.validators.func = (value, {validator, message = '%{key} is ongeldig'}, key, attributes) => {
  if (! validator(value, key, attributes))
    return jsValidate.format(message, {key: value});
};
jsValidate.validators.if = (value, {field, hasValue, then}, key, attributes) => {
  if (! (field in attributes) || attributes[field] !== hasValue)
    return;
  let output = jsValidate({[key]: value}, {[key]: then}, options);
  return (output||{})[key];
};


let constraints = {
  FirstName: {
    presence: {
      message: "Geen geldige voornaam ingevuld"
    }
  },
  LastName: {
    presence: {
      message: "Geen geldige achternaam ingevuld"
    }
  },
  Username: {
    equality: {
      attribute: "Email",
      message: "Username en Email moeten het zelfde zijn"
    }
  },
  Email: {
    email: {
      message: "Geen geldig e-mailadres ingevuld"
    }
  },
  IBAN: {
    if: {
      field: "HasSubscription",
      hasValue: true,
      then: {
        func: {
          validator: (value) => iban.isValid(value),
          message: 'Geen geldig IBAN-nummer ingevoerd'
        }
      }
    }
  },
  PhoneNumber: {
    presence: {
      message: 'Geen geldig telefoonnummer ingevoerd'
    },
    func: {
      validator: (value) => {
        value = String(value).replace(/ /g, '');
        const regexVast = /^(((0)[1-9]{2}[0-9][-]?[1-9][0-9]{5})|((\\+31|0|0031)[1-9][0-9][-]?[1-9][0-9]{6}))$/,
              regexMobiel = /^(((\\+31|0|0031)6){1}[1-9]{1}[0-9]{7})$/;
        return (regexVast.test(value) || regexMobiel.test(value))
      },
      message: 'Geen geldig telefoonnummer ingevoerd'
    }
  },
  Street: {
    presence: {
      message: 'Geen geldige straat ingevoerd'
    }
  },
  HouseNumber: {
    numericality: {
      onlyInteger: true,
      notValid: 'Huisnummer mag enkel een getal bevatten'
    }
  },
  PostCode: {
    format: {
      pattern: "[1-9][0-9]{3}[\\s]?[A-Za-z]{2}",
      flags: "i",
      message: 'Geen geldige postcode ingevoerd'
    }
  },
  City: {
    presence: {
      message: 'Geen geldige stad ingevoerd'
    }
  },
  NewPassword: {
    format: {
      pattern: "(?=.*[a-z0-9])(?=.*[A-Z]).+",
      message: 'Het wachtwoord moet minimaal 1 hoofdletter hebben'
    },
    length: {
      minimum: 8,
      tooShort: 'Het wachtwoord moet uit minimaal 8 tekens bestaan'
    }
  },
  ConfirmPassword: {
    equality: {
      attribute: "NewPassword",
      message: "De wachtwoorden komen niet overeen"
    }
  },
  HasSubscription: {
    presence: {
      message: 'Geen abonnement ingegeven'
    }
  },
  IsActive: {
    presence: {
      message: 'Geen activatie ingegeven'
    }
  },
  IdUser: {
    presence: {
      message: 'Geen user opgegeven'
    },
    numericality: {
      onlyInteger: true,
      notValid: 'Gebruiker id mag enkel een getal zijn'
    }
  },
  IdJob: {
    presence: {
      message: 'Geen klus opgegeven'
    },
    numericality: {
      onlyInteger: true,
      notValid: 'Klus id mag enkel een getal zijn'
    }
  },
  Date: {
    presence: {
      message: 'Geen datum opgegeven',
    },
    date: {
      pattern: "(\d{1,4}-\d{1,2}-\d{1,2})",
      message: 'Datum voldoet niet aan het format yyyy-mm-dd'
    },
  },
  Times: {
    func: {
      validator: (value) => {
        if (! Array.isArray(value))
          return false;
        if (value.length != 2)
          return false;
        const regexTime = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/;
        return ! value.some(time => regexTime.test(value));
      },
      message: 'Geen geldig tijdslot ingevoerd'
    }
  }
};


const Validate = (obj,constraints,fields) => {
  let errors = jsValidate(obj,constraints,options) || {};
  if (fields.length)
    errors = pick(errors, ...fields);
  return Object.keys(errors).length ? errors : null;
};
const CreateValidator = (constraints) => (obj,...fields) => Validate(obj,constraints,fields);


const newUserConstraint = pick(constraints, 'NewPassword','HouseNumber','Addition','Email','IBAN','FirstName','IsActive','City','HasSubscription','ConfirmPassword','Username','PhoneNumber','Street','LastName','PostCode');
const editUserConstraint = pick(constraints, 'HouseNumber','Addition', 'IBAN','FirstName','HasSubscription','PhoneNumber','LastName','PostCode');
const editUserPasswordConstraint = pick(constraints, 'NewPassword','ConfirmPassword');
const newOrderConstraint = pick(constraints, 'IdJob', 'HouseNumber','PostCode','Date','Times');


module.exports = {
  newUser: CreateValidator(newUserConstraint),
  editUser: CreateValidator(editUserConstraint),
  editUserPassword: CreateValidator(editUserPasswordConstraint),
  newOrder: CreateValidator(newOrderConstraint)
};

