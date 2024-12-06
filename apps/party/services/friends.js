const db = require('../../../utils/database');

class FriendsService {
    static async getFriendsByUserId(userId) {
        let result = await db.execute(`
            SELECT 
                userOne.id,
                userOne.username,
                userTwo.id,
                userTwo.username,
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
                friend.status = 'accepted';`,
            {
                userId
            }
        );

        if (!result.rows.length) {
            return [];
        }

        return result.rows.map(row => {
            if (row.userTwo.id != userId) {
                row.userTwo.status = row.friend.status;
                return {
                    userId: row.userTwo.id,
                    username: row.userTwo.username
                };
            } else {
                row.userOne.status = row.friend.status;
                return {
                    userId: row.userOne.id,
                    username: row.userOne.username
                };
            }
        });
    }

    static async getFriendRequestsByUserId(userId) {
        let result = await db.execute(`
            SELECT
                userOne.id,
                userOne.username,
                userTwo.id,
                userTwo.username,
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
            let request = {};

            if (row.userTwo.id != userId) {
                request = {
                    userId: row.userTwo.id,
                    username: row.userTwo.username
                };
            } else {
                request = {
                    userId: row.userOne.id,
                    username: row.userOne.username
                };
            }

            request.status = row.friend.status;

            requests.push(request)
        }

        return requests;
    }

    static async addFriend(userOneId, userTwoId) {
        let result =  await db.insert('friend',  { userOneId, userTwoId }); // data = {userOneId, userTwoId}

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

    static async searchFriends(userId, search) {
        let result = await db.execute(`
            SELECT 
                userOne.id as userOneId,
                userOne.username as userOneUsername,
                userTwo.id as userTwoId,
                userTwo.username as userTwoUsername,
                friend.status as status
                
            FROM 
                friend 

                INNER JOIN user userOne ON
                    userOne.id = friend.userOneId

                INNER JOIN user userTwo ON
                    userTwo.id = friend.userTwoId
            
            WHERE 
                friend.status = 'accepted' AND
                (
                    friend.userOneId = [userId] OR
                    friend.userTwoId = [userId]
                ) 
                    AND
                (
                    userOne.username like [search1] OR
                    userOne.username like [search2] OR
                    userOne.firstName like [search3] OR
                    userOne.firstName like [search4] OR
                    userTwo.username like [search5] OR
                    userTwo.username like [search6] OR
                    userTwo.firstName like [search7] OR
                    userTwo.firstName like [search8]
                )
            UNION ALL
            SELECT
                userOne.id as userOneId,
                userOne.username as userOneUserName,
                [userId] as userTwoId,
                '' as userTwoUsername,
                'requestable' as status
            FROM
                USER as userOne
            WHERE 
                userOne.id NOT IN
            (
                SELECT userOneId FROM FRIEND WHERE userTwoId = [userId] AND NOT status = 'rejected'
                UNION
                SELECT userTwoId FROM FRIEND WHERE userOneId = [userId] AND NOT status = 'rejected'
            )
                AND NOT userOne.id = [userId]
                AND
            (
                userOne.username like [search1] OR
                userOne.username like [search2] OR
                userOne.firstName like [search3] OR
                userOne.firstName like [search4]
            );`,
            {
                userId,
                search1: search + '%',
                search2: '%' + search + '%',
                search3: search + '%',
                search4: '%' + search + '%',
                search5: search + '%',
                search6: '%' + search + '%',
                search7: search + '%',
                search8: '%' + search + '%'
            }
        );

        if (!result.rows.length) {
            return [];
        }

        return result.rows.map(row => {
            if (row.userTwoId != userId) {
                //row.userTwo.status = row.friend.status;
                return {
                    userId: row.userTwoId,
                    username: row.userTwoUsername
                };
            } else {
                //row.userOne.status = row.friend.status;
                return {
                    userId: row.userOneId,
                    username: row.userOneUsername
                };
            }
        });
    }
}

module.exports = FriendsService;