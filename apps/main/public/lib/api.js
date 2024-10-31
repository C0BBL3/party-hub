const API_BASE_URL = '/api';

let api = {
    _get: (url, callback) => {
        Core.get(url, (error, response) => {
            callback(error, response);
        });
    },
    _post: (url, data, callback) => {
        data = data ? data : {};

        Core.post(url, data, (error, response) => {
            if (callback && typeof callback === "function") {
                callback(error, response);
            }
        });
    },    
};
api.get = async (url) => {
    return new Promise((resolve, reject) => {
        api._get(url, (error, response) => {
            if (error) {
                resolve(null);
            } else {
                resolve(response);
            }
        });
    });
};

api.post = async (url, data) => {
    return new Promise((resolve, reject) => {
        api._post(url, data, (error, response) => {
            if (error) {
                resolve(null);
            } else {
                resolve(response);
            }
        });
    });
};



 
