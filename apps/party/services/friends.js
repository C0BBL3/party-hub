/*
Defines the services required by the Friends screen
Author Colby Roberts
*/
const db = require('../../../utils/database');

class FriendsService {
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
            return [];
        }

        let friends = [];
        for (let row of result.rows) {
            let friend = row.userTwo.id != userId ? row.userTwo : row.userOne;
            if (row.userOne.id == userId) {
                friend.status = row.friend.status == 'accepted' ? 2 : 1;
            } else {
                if (row.friend.status == 'pending') { continue; }
                friend.status = 2;
            }

            friends.push(friend);
        }

        return friends;
    }

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
            return [];
        }

        let requests = [];

        for (let row of result.rows) {
            let request = row.userOne;
            requests.push(request)
        }

        return requests;
    }

    static async addFriend(userOneId, userTwoId) {
        let result =  await db.insert('friend',  { userOneId, userTwoId }); // data = {userOneId, userTwoId}

        return !result.error;
    }

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
                )`,
            {
                userOneId,
                userTwoId
            }
        );

        return !result.error;
    }

    static async updateStatus(userOneId, userTwoId, status) { // works even if user id's are backwards (probably idk i didnt test it :P )
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

        return !result.error;
    }

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

        if (!result.error) {
            return result.rows.length == 1;
        } else {
            return false;
        }
    }

    static async checkIfFriend(userOneId, userTwoId) {
        const result = await db.execute(`
            SELECT
                friend.status
                
            FROM
                friend
                
            WHERE
                (
                    (
                        friend.userOneId = [userOneId] AND
                        friend.userTwoId = [userTwoId] 
                    ) 
                    OR
                    (
                        friend.userOneId = [userTwoId] AND
                        friend.userTwoId = [userOneId]
                    )
                ) AND
                friend.status = 'accepted';`,
            {
                userOneId,
                userTwoId
            }
        );

        if (!result.error) {
            return result.rows.length == 1;
        } else {
            return false;
        }
    }

    static async searchForFriend(userId, search) {
        userId = 0;
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
                    patron.username like [search] OR
                    patron.description like [search] OR
                    patron.tags like [search]
                );`,
            {
                userId,
                search: '%' + search + '%',
            }
        );

        if (result.error || result.rows.length == 0) {
            return [];
        }

        let patrons = [];

        for (let row of result.rows) {
            let patron = row.patron;

            let status1 = await FriendsService.checkIfFriend(userId, patron.id);
            let status2 = await FriendsService.checkIfPending(userId, patron.id);

            if (status1 || status2) { continue; }

            patrons.push(patron);
        }

        return patrons;
    }
}

module.exports = FriendsService;