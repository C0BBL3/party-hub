const APIParameter = require("../lib/api-parameter");

const parameter = new APIParameter();

const schema = {
    title: {
        isStr: {
            errorMessage: "Invalid value for parameter title",
            bail: true
        },
        notEmpty: {
            errorMessage: "Must enter a title",
            bail: true
        }
    },
    address: {
        isStr: {
            errorMessage: "Invalid value for parameter address",
            bail: true
        },
        notEmpty: {
            errorMessage: "Must enter an address",
            bail: true
        }
    },
    "address.streetAddesss": {
        isString: { 
            errorMessage: "Invalid value for street address",
            bail: true
        },
        custom: {
            options: parameter.isDay.bind(parameter),
            bail: true
        },
        notEmpty: { 
            errorMessage: "Must enter a street address",
            bail: true
        }
    },
    "address.postalCode": {
        isString: { 
            errorMessage: "Invalid value for postal code",
            bail: true
        },
        custom: {
            options: parameter.isDay.bind(parameter),
            bail: true
        },
        notEmpty: { 
            errorMessage: "Must enter a postal code",
            bail: true
        }
    },
    "address.city": {
        isString: { 
            errorMessage: "Invalid value for city",
            bail: true
        },
        custom: {
            options: parameter.isDay.bind(parameter),
            bail: true
        },
        notEmpty: { 
            errorMessage: "Must enter a city",
            bail: true
        }
    },
    "address.state": {
        isString: { 
            errorMessage: "Invalid value for state",
            bail: true
        },
        custom: {
            options: parameter.isDay.bind(parameter),
            bail: true
        },
        notEmpty: { 
            errorMessage: "Must enter a state",
            bail: true
        }
    },
    privacy: {
        isStr: {
            errorMessage: "Invalid value for parameter privacy",
            bail: true
        }
    },
    start: {
        isObject: {
            errorMessage: "Invalid type for start date",
            bail: true
        }
    },
    "start.date": {
        isString: { 
            errorMessage: "Invalid value for start day",
            bail: true
        },
        custom: {
            options: parameter.isDay.bind(parameter),
            bail: true
        },
        notEmpty: { 
            errorMessage: "Must enter a start day",
            bail: true
        }
    },
    "start.time": {
        isString: { 
            errorMessage: "Invalid value for start time",
            bail: true
        },
        custom: {
            options: parameter.isTime.bind(parameter),
            bail: true
        },
        notEmpty: { 
            errorMessage: "Must enter a start time",
            bail: true
        }
    },
    vibes: {
        isStr: {
            errorMessage: "Invalid value for parameter vibes",
            bail: true
        },
        notEmpty: {
            errorMessage: "Must enter some vibes",
            bail: true
        }
    },
    description: {
        isStr: {
            errorMessage: "Invalid value for parameter description",
            bail: true
        },
        notEmpty: {
            errorMessage: "Must enter a description",
            bail: true
        }
    },
    pictureBase64: {
        isStr: {
            errorMessage: "Invalid value for parameter pictureBase64",
            bail: true
        },
        notEmpty: {
            errorMessage: "Must enter a pictureBase64",
            bail: true
        }
    }
}

module.exports = schema;