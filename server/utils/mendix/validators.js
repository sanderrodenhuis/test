const Validate = require('validate.js'),
      iban = require('iban'),
      pick = require('../helpers').pick,
      options = {fullMessages:false};

Validate.validators.func = (value, {validator, message = '%{key} is ongeldig'}, key, attributes) => {
  if (! validator(value, key, attributes))
    return Validate.format(message, {key: value});
};
Validate.validators.if = (value, {field, hasValue, then}, key, attributes) => {
  if (! (field in attributes) || attributes[field] !== hasValue)
    return;
  let output = Validate({[key]: value}, {[key]: then}, options);
  return (output||{})[key];
};


let userConstraint = {
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
      message: 'Geen userId opgegeven'
    },
    numericality: {
      onlyInteger: true,
      notValid: 'UserId mag enkel een getal zijn'
    }
  }
};


const newUserConstraint = pick(userConstraint, 'NewPassword','HouseNumber','Addition','Email','IBAN','FirstName','IsActive','City','HasSubscription','ConfirmPassword','Username','PhoneNumber','Street','LastName','PostCode');
const editUserConstraint = pick(userConstraint, 'HouseNumber','Addition','Email','IBAN','FirstName','IsActive','City','HasSubscription','Username','PhoneNumber','Street','LastName','PostCode', 'IdUser');
const editUserPasswordConstraint = pick(userConstraint, 'NewPassword','ConfirmPassword');



module.exports = {
  newUser: (obj) => Validate(obj,newUserConstraint, options),
  editUser: (obj) => Validate(obj,editUserConstraint, options),
  editPassword: (obj) => Validate(obj,editUserPasswordConstraint, options)
};

