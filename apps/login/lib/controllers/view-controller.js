class ViewController {
    static isAuthorized(userId, studentId) {

        if (studentId && studentId !== userId) {
            return false;
        } 

        return true;
    }
}

module.exports = ViewController;