let Validate = require('validate.js'),
    iban = require('iban'),
    pick = require('../helpers').pick;

Validate.validators.func = (value, {validator, message = '%{key} is ongeldig'}, key, attributes) => {
  if (! validator(value, key, attributes))
    return Validate.format(message, {key, value});
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
    presence: {
      message: "Geen geldige gebruikersnaam ingevuld"
    },
    email: {
      message: "Geen geldige gebruikersnaam ingevuld"
    }
  },
  Email: {
    email: {
      message: "Geen geldig e-mailadres ingevuld"
    }
  },
  IBAN: {
    func: {
      validator: (value, key, attributes) => ((!value) || iban.isValid(value))
    }
  },
  PhoneNumber: {
    presence: {
      message: 'Geen geldig telefoonnummer ingevoerd'
    },
    func: {
      validator: (value) => {
        value = value.replace(/ /g, '');
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
    presence: {
      message: 'Geen geldig huisnummer ingevoerd'
    },
    numericality: {
      onlyInteger: true,
      notInteger: 'Huisnummer mag enkel een getal bevatten'
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
      message: 'Wachtwoord moet minimaal 1 hoofdletter hebben'
    },
    length: {
      minimum: 8,
      tooShort: 'Wachtwoord moet uit minimaal 8 tekens bestaan'
    }
  },
  ConfirmPassword: {
    equality: {
      attribute: "NewPassword",
      message: "Wachtwoorden komen niet overeen"
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
  }
};


const newUserConstraint = pick(userConstraint, 'NewPassword','HouseNumber','Addition','Email','IBAN','FirstName','IsActive','City','HasSubscription','ConfirmPassword','Username','PhoneNumber','Street','LastName','PostCode');
const editUserConstraint = pick(userConstraint, 'HouseNumber','Addition','Email','IBAN','FirstName','IsActive','City','HasSubscription','Username','PhoneNumber','Street','LastName','PostCode');
const editUserPasswordConstraint = pick(userConstraint, 'NewPassword','ConfirmPassword');



const options = {fullMessages:false};
module.exports = {
  newUser: (obj) => Validate(obj,newUserConstraint, options),
  editUser: (obj) => Validate(obj,editUserConstraint, options),
  editPassword: (obj) => Validate(obj,editUserPasswordConstraint, options)
};

