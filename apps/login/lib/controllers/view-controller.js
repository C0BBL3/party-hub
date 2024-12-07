/*
Creates the ViewController class which restricts access to views
using the isAuthorized method which checks a user id against a student id
Author Colby Roberts
*/
class ViewController {
    static isAuthorized(userId, studentId) {

        if (studentId && studentId !== userId) {
            return false;
        } 

        return true;
    }
}

module.exports = ViewController;