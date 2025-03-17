const moment = require('moment');
const db = require('../../utils/database');

class HostService {
    static async getHostInfo(userId) {
        const result = await db.execute(`
            SELECT
                host.id,
                host.created,
                host.firstName,
                host.lastName,
                host.username,
                host.email,
                host.isHost
                
            FROM 
                user as host

            WHERE
                host.id = [hostId];`,
            {
                hostId: userId
            }
        );
        
        if (result.rows.length == 0) {
            return {};
        }

        const host = result.rows[0].host;

        return host;
    }
}

module.exports = HostService;