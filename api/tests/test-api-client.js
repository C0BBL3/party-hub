const util = require('util');
const crypto = require('crypto');
const CryptoJS = require('crypto-js');

const domain = 'http://localhost:3333';
// const domain = 'https://www.galacticconquerors.com';
const BASE_URL = `${domain}/api`

const getPatron = async (publicKey, patronId) => {
    try {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Strict-Transport-Security': "max-age=31536000",
            'Public-API-Key': publicKey,
        };

        const res = await fetch(`${BASE_URL}/patron/${patronId}`, { 
            method: 'GET',
            headers 
        });

        return (await res.json());
    } catch (error) {
        let res = 'Error fetching student info: ';
        res += JSON.stringify(error.response ? error.response.data : error.message);
        return res;
    }
};

const getHost = async (publicKey, hostId) => {
    try {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Strict-Transport-Security': "max-age=31536000",
            'Public-API-Key': publicKey,
        };

        const res = await fetch(`${BASE_URL}/host/${hostId}`, { 
            method: 'GET',
            headers 
        });

        return (await res.json());
    } catch (error) {
        let res = 'Error fetching student info: ';
        res += JSON.stringify(error.response ? error.response.data : error.message);
        return res;
    }
};

const getParty = async (publicKey, partyId) => {
    try {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Strict-Transport-Security': "max-age=31536000",
            'Public-API-Key': publicKey
        };

        const res = await fetch(`${BASE_URL}/party/${partyId}`, { 
            method: 'GET',
            headers 
        });

        return (await res.json());
    } catch (error) {
        let res = 'Error fetching party:';
        res += JSON.stringify(error.response ? error.response.data : error.message);
        return res;
    }
};

const getFeaturedParties = async (publicKey) => {
    try {
        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Strict-Transport-Security': "max-age=31536000",
            'Public-API-Key': publicKey
        };

        const res = await fetch(`${BASE_URL}/featured-parties`, { 
            method: 'GET',
            headers 
        });

        return (await res.json());
    } catch (error) {
        let res = 'Error fetching party:';
        res += JSON.stringify(error.response ? error.response.data : error.message);
        return res;
    }
};

const generateSignature = (secretKey, verb, contentMD5, contentType, timestamp, requestURI, nonce) => {
    const StringToSign = verb + '\n'
                       + contentMD5 + '\n'
                       + contentType + '\n'
                       + timestamp + '\n'
                       + requestURI + '\n'
                       + nonce;

    const signature = CryptoJS.HmacSHA256(StringToSign, secretKey).toString(CryptoJS.enc.Base64);

    return signature;
}

const postParty = async (publicKey, secretKey, body) => {
    try {
        const verb = 'POST'
        const contentMD5 = CryptoJS.MD5(body).toString(CryptoJS.enc.Hex);
        const contentType = 'application/json';
        const timestamp = Math.floor(Date.now() / 1000);
        const requestURI = `${BASE_URL}/party`;
        const nonce = crypto.randomBytes(16).toString('base64');

        const signature = generateSignature(secretKey, verb, contentMD5, contentType, timestamp, requestURI, nonce);

        const headers = {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'Strict-Transport-Security': "max-age=31536000",
            'Public-API-Key': publicKey,
            'Authorization': `TXC-HMAC-SHA256 ${publicKey}:${signature}`,
            'X-TXC-Nonce': nonce,
            'X-TXC-Timestamp': timestamp
        };

        logObject(headers);
        logObject(body);

        const res = await fetch(`${BASE_URL}/party`,  { 
            method: 'POST',
            body,
            headers 
        });

        return (await res.json());
    } catch (error) {
        let res = 'Error posting student:';
        res += JSON.stringify(error.response ? error.response.data : error.message);
        return res;
    }
};

const updateParty = async (publicKey, secretKey, body) => {
    try {
        const verb = 'POST'
        const contentMD5 = CryptoJS.MD5(body).toString(CryptoJS.enc.Hex);
        const contentType = 'application/json';
        const timestamp = Math.floor(Date.now() / 1000);
        const requestURI = `${BASE_URL}/party/update`;
        const nonce = crypto.randomBytes(16).toString('base64');

        const signature = generateSignature(secretKey, verb, contentMD5, contentType, timestamp, requestURI, nonce);

        const headers = {
            'Accept': 'application/json',
            'Content-Type': contentType,
            'Strict-Transport-Security': "max-age=31536000",
            'Public-API-Key': publicKey,
            'Authorization': `TXC-HMAC-SHA256 ${publicKey}:${signature}`,
            'X-TXC-Nonce': nonce,
            'X-TXC-Timestamp': timestamp
        };

        const res = await fetch(`${BASE_URL}/party/update`,  { 
            method: 'POST',
            body,
            headers 
        });

        return (await res.json());
    } catch (error) {
        let res = 'Error posting student:';
        res += JSON.stringify(error.response ? error.response.data : error.message);
        return res;
    }
};


function logObject(object) {
    console.log(util.inspect(object, {showHidden: false, depth: null, colors: true}));
}

async function main() {

    // let publicKey = 'pk_test_abcdefghijklmnopqrstuvwxyz12345678'; // dummy key
    let publicKey = 'pk_live_VnjUUivZKZipUZ2ElbBiD906onj8R3Q9H8';

    // let secretKey = 'sk_test_abcdefghijklmnopqrstuvwxyz12345678'; // dummy key
    let secretKey = 'sk_live_C0ayNGKYcp.mqm451jQI3n.xM5Ku3Uncti';

    // let patron = await getPatron(publicKey, 1);
    // logObject(patron);

    // let host = await getHost(publicKey, 1);
    // logObject(host);

    // let party = await getParty(publicKey, 1);
    // logObject(party);

    // let featuredParties = await getFeaturedParties(publicKey);
    // logObject(featuredParties);

    let data = {
        hostId: 1,
        start: {
            day: "Friday",
            time: "7:30 PM"
        },
        title: "Pi-tacular pi-arty!",
        vibes: "pi-day,314,pi,pie",
        description: "A Pi-tacular pi-arty on pi-day!",
        privacy: "Discoverable",
        pictureBase64: "I am not writing out a base 64 string for an image but just imagine this is a very long text of base 64 that would be parsed into an image via html.",
        address: {
            state: "OR",
            city: "Eugene",
            postalCode: 97401,
            streetAddess: "710 E 18th Ave",
        }
    };

    let partyPost = await postParty(publicKey, secretKey, data);
    logObject(partyPost);

    let update = {
        partyId: 420,
        start: {
            day: "Friday",
            time: "7:30 PM"
        },
        vibes: "pi-day,314,pi,pie",
        description: "A Pi-tacular pi-arty on pi-day!",
        privacy: "Discoverable",
        pictureBase64: "I am not writing out a base 64 string for an image but just imagine this is a very long text of base 64 that would be parsed into an image via html.",
    };

    // let partyUpdate = await updateParty(publicKey, secretKey, update);
    // logObject(partyUpdate);

    process.exit();
}

main();