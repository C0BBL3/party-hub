const db = require('../../utils/database');

class CustomerService {
    static async getSecretKey(customerId, publicKey) {
        if (publicKey === 'pk_test_abcdefghijklmnopqrstuvwxyz12345678') { // test keys
            return 'sk_test_abcdefghijklmnopqrstuvwxyz12345678';
        } 
        
        let result = await db.execute(`
            SELECT 
                id,
                apiSecretKey
                
            FROM
                customer
                
            WHERE
                id = [customerId] AND
                apiPublicKey = [publicKey];`,
            {
                customerId,
                publicKey
            }
        );

        if (result.rows.length === 1) {
            let row = result.rows[0];

            return row.customer.apiSecretKey;
        } else {
            return null;
        }
    }


    static async validatePublicKey(publicKey) {
        let result = await db.execute(`
            SELECT 
                id,
                created,
                clearance
                
            FROM
                customer
                
            WHERE
                apiPublicKey = [publicKey];`,
            {
                publicKey
            }
        );

        if (result.rows.length === 1) {
            let row = result.rows[0];

            return row.customer;
        } else {
            return null;
        }
    }

    static async checkAuthorizationForPatron(publicKey, patronId) {
        let result = await db.execute(`
            SELECT 
                patron.id
                
            FROM
                user as patron

                LEFT JOIN customer on
                    patron.customerId = customer.id
                
            WHERE
                customer.apiPublicKey = [publicKey] AND
                patron.id = [patronId];`,
            {
                publicKey,
                patronId
            }
        );

        if (result.rows.length === 1) {
            let row = result.rows[0];

            return row.patron;
        } else {
            return null;
        }
    }

    static async checkAuthorizationForParty(publicKey, partyId) {
        let result = await db.execute(`
            SELECT 
                party.id
                
            FROM
                party

                LEFT JOIN partyhostlink ON
                    party.id = partyhostlink.partyId

                LEFT JOIN user as host ON
                    partyhostlink.hostId = host.id

                LEFT JOIN customer as customer1 on
                    host.customerId = customer1.id AND
                    (
                        customer.clearance = 'host' OR
                        customer.clearance = 'admin'
                    )

                LEFT JOIN partypatronlink ON
                    party.id = partypatronlink.partyId

                LEFT JOIN user as patron ON
                    partypatronlink.hostId = patron.id

                LEFT JOIN customer as customer2 on
                    patron.customerId = customer2.id
                
            WHERE
                (
                    customer1.apiPublicKey = [publicKey] OR
                    customer2.apiPublicKey = [publicKey]
                ) AND
                party.id = [partyId];`,
            {
                publicKey,
                partyId
            }
        );

        if (result.rows.length === 1) {
            let row = result.rows[0];

            return row.org;
        } else {
            return null;
        }
    }

    static async checkAuthorizationForHost(publicKey, hostId) {
        let result = await db.execute(`
            SELECT 
                host.id
                
            FROM
                user as host

                LEFT JOIN customer on
                    customer.id = host.customerId AND
                    (
                        customer.clearance = 'host' OR
                        customer.clearance = 'admin'
                    )
                
            WHERE
                customer.apiPublicKey = [publicKey] AND
                host.id = [hostId];`,
            {
                publicKey,
                hostId
            }
        );

        if (result.rows.length === 1) {
            let row = result.rows[0];

            return row.patron;
        } else {
            return null;
        }
    }

    static async getCustomerUserIdFromPublicKey(publicKey) {
        const result = await db.execute(`
            SELECT
                user.id
                
            FROM
                user
                
                INNER JOIN customer ON
                    customer.id = user.customerId
                    
            WHERE
                customer.apiPublicKey = [publicKey];`,
            {
                publicKey
            }
        );

        if (result.rows.length === 1) {
            let row = result.rows[0];

            return row.user.id;
        } else {
            return null;
        }
    }
}

module.exports = CustomerService;