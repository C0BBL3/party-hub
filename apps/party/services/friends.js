/*
Defines the services required by the Friends screen
Author Colby Roberts
*/

const db = require('../../../utils/database');

class FriendsService {
    // Retrieves all friends for a user by userId
    static async getFriendsByUserId(userId) {
        let result = await db.execute(`
            SELECT 
                userOne.id,
                userOne.username,
                userOne.tags,
                userOne.description,
                userOne.pictureBase64,
                userOne.isHost,
                userTwo.id,
                userTwo.username,
                userTwo.tags,
                userTwo.description,
                userTwo.pictureBase64,
                userTwo.isHost,
                friend.status
            FROM 
                friend 
            INNER JOIN user userOne ON
                userOne.id = friend.userOneId
            INNER JOIN user userTwo ON
                userTwo.id = friend.userTwoId
            WHERE 
                (
                    friend.userOneId = [userId] OR
                    friend.userTwoId = [userId]
                ) AND
                friend.status != 'rejected';`,
            {
                userId
            }
        );

        if (!result.rows.length) {
            return []; // Return empty array if no friends are found
        }

        let friends = [];
        // Iterate through the results and determine which user is the friend
        for (let row of result.rows) {
            let friend = row.userTwo.id != userId ? row.userTwo : row.userOne;
            // Set the friend status based on the stored status
            if (row.userOne.id == userId) {
                friend.status = row.friend.status == 'accepted' ? 2 : 1;
            } else {
                if (row.friend.status == 'pending') { continue; }
                friend.status = 2;
            }

            friends.push(friend); // Add the friend to the list
        }

        return friends;
    }

    // Retrieves all pending friend requests for a user by userId
    static async getFriendRequestsByUserId(userId) {
        let result = await db.execute(`
            SELECT
                userOne.id,
                userOne.username,
                userOne.tags,
                userOne.description,
                userOne.pictureBase64,
                userOne.isHost
            FROM 
                friend 
            INNER JOIN user userOne ON
                userOne.id = friend.userOneId
            WHERE 
                friend.userTwoId = [userId] AND
                friend.status = 'pending';`,
            {
                userId
            }
        );

        if (!result.rows.length) {
            return []; // Return empty array if no requests are found
        }

        let requests = [];
        for (let row of result.rows) {
            let request = row.userOne; // Add the user that sent the friend request
            requests.push(request);
        }

        return requests;
    }

    // Adds a new friend relationship between two users
    static async addFriend(userOneId, userTwoId) {
        let result = await db.insert('friend', { userOneId, userTwoId }); // Insert a new friend record

        return !result.error; // Return true if no error occurred, else false
    }

    // Removes a friend relationship between two users
    static async removeFriend(userOneId, userTwoId) {
        const result = await db.execute(`
            DELETE FROM 
                friend 
            WHERE
                (
                    userOneId = [userOneId] AND
                    userTwoId = [userTwoId]
                ) 
                OR
                (
                    userTwoId = [userOneId] AND
                    userOneId = [userTwoId]
                );`,
            {
                userOneId,
                userTwoId
            }
        );

        return !result.error; // Return true if no error occurred, else false
    }

    // Updates the status of the friendship between two users
    static async updateStatus(userOneId, userTwoId, status) {
        let result = await db.execute(`
            UPDATE 
                friend
            SET 
                status = [status]
            WHERE
                (
                    userOneId = [userOneId] AND
                    userTwoId = [userTwoId]
                ) 
                OR
                (
                    userOneId = [userTwoId] AND
                    userTwoId = [userOneId]
                );`,
            {
                userOneId, 
                userTwoId, 
                status
            }
        );

        return !result.error; // Return true if no error occurred, else false
    }

    // Checks if a friend request is pending between two users
    static async checkIfPending(userOneId, userTwoId) {
        const result = await db.execute(`
            SELECT
                friend.status
            FROM
                friend
            WHERE
                friend.userOneId = [userOneId] AND
                friend.userTwoId = [userTwoId] AND
                friend.status = 'pending';`,
            {
                userOneId,
                userTwoId
            }
        );

        return !result.error && result.rows.length == 1; // Return true if pending request exists
    }

    // Checks if two users are friends (status 'accepted')
    static async checkIfFriend(userOneId, userTwoId) {
        const result = await db.execute(`
            SELECT
                friend.status
            FROM
                friend
            WHERE
                (
                    (friend.userOneId = [userOneId] AND friend.userTwoId = [userTwoId]) 
                    OR
                    (friend.userOneId = [userTwoId] AND friend.userTwoId = [userOneId])
                ) AND
                friend.status = 'accepted';`,
            {
                userOneId,
                userTwoId
            }
        );

        return !result.error && result.rows.length == 1; // Return true if they are friends
    }

    // Searches for potential friends based on the search query
    static async searchForFriend(userId, search) {
        let result = await db.execute(`
            SELECT 
                patron.id,
                patron.username,
                patron.tags,
                patron.description,
                patron.pictureBase64,
                patron.isHost
            FROM 
                user as patron
            WHERE 
                patron.id != [userId] AND
                (
                    patron.username LIKE [search] OR
                    patron.description LIKE [search] OR
                    patron.tags LIKE [search]
                );`,
            {
                userId,
                search: '%' + search + '%',
            }
        );

        if (result.error || result.rows.length == 0) {
            return []; // Return empty array if no matches found
        }

        let patrons = [];
        for (let row of result.rows) {
            let patron = row.patron;

            // Check if the user is already a friend or has a pending request
            let status1 = await FriendsService.checkIfFriend(userId, patron.id);
            let status2 = await FriendsService.checkIfPending(userId, patron.id);

            // If they are already friends or have a pending request, skip this patron
            if (status1 || status2) { continue; }

            patrons.push(patron); // Add the potential friend to the list
        }

        return patrons; // Return the list of potential friends
    }
}

module.exports = FriendsService;