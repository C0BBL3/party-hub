var API_BASE_URL = '/settings/api/';

var api = {
    get: async (url) => {
        return new Promise((resolve, reject) => {
            this._get(url, (error, response) => {
                if (error) {
                    resolve(null);
                } else {
                    resolve(response);
                }
            });
        });
    },
    post: async (url, data) => {
        return new Promise((resolve, reject) => {
            this._post(url, data, (error, response) => {
                if (error) {
                    resolve(null);
                } else {
                    resolve(response);
                }
            });
        });
    },
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


 
