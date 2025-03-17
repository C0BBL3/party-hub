class APISecurity {
    constructor() { 
        this.internalServerErrorReturn = {
            isAuthenticated: false,
            error: { code: 500, message: "Internal server error." }
        };

        this.noThreatDetectedReturn = {
            isCleared: true,
            error: null
        };

        this.threatDetectedReturn = {
            isCleared: false,
            error: { code: 400, message: "Bad Request." }
        };

        this.sqlInjectionPatterns = [
            /('|"|`|;|--|\/\*)/i, // Common SQL meta-characters
            /(union.*select|select.*from|insert.*into|update.*set|delete.*from)/i, // SQL commands
            /(drop\s+table|alter\s+table|create\s+table)/i, // SQL schema manipulation
            /(\bOR\b.*?=|\bAND\b.*?=)/i // Boolean-based SQL injection
        ];

        this.xssPatterns = [
            /(<script.*?>.*?<\/script>)/i, // Inline script tags
            /(<.*?on\w+=.*?>)/i, // Inline event handlers
            /(&(#x?)[0-9A-F]+;)/i, // Encoded characters often used in XSS
            /(javascript:|data:text\/html)/i // JavaScript execution vectors
        ];
    }

    detectMaliciousAttack(object) {    
        try {
            for (const [key, value] of Object.entries(object)) {
                const headerKey = String(key);
                const headerValue = String(value);
        
                if (this.isSQLInjection(headerKey) || this.isSQLInjection(headerValue)) {
                    return this.threatDetectedReturn;
                }
        
                if (this.isXSSAttack(headerKey) || this.isXSSAttack(headerKey)) {
                    return this.threatDetectedReturn;
                }
            }
        
            return this.noThreatDetectedReturn;
        } catch(e) {
            return this.internalServerErrorReturn;
        }
    }

    detectMaliciousParameter(input_) {
        try {
            const input = String(input_);
            const isInputMalicious = this.isSQLInjection(input) || this.isXSSAttack(input);
            return isInputMalicious ? this.threatDetectedReturn : this.noThreatDetectedReturn;
        } catch(e) {
            return this.internalServerErrorReturn;
        }
    }

    isSQLInjection(str) {
        return this.sqlInjectionPatterns.some(pattern => pattern.test(str));
    }

    isXSSAttack(str) {
        return this.xssPatterns.some(pattern => pattern.test(str));
    }

    sanitizeObject(object) {
        try {
            if (typeof object !== 'object' || object === null) return object;
        
            for (const key in object) {
                if (typeof object[key] === 'string') {
                    object[key] = this.sanitizeInput(String(object[key]));
                } else if (typeof object[key] === 'object') {
                    object[key] = this.sanitizeObject(object[key]); 
                }
            }
        
            return object;
        } catch(e) {
            return this.internalServerErrorReturn;
        }
    }

    sanitizeInput(input) {
        try {
            if (typeof input !== 'string') return input; // Only process strings
        
            return input
                .replace(/</g, "&lt;") // Escape < to prevent XSS
                .replace(/>/g, "&gt;") // Escape > to prevent XSS
                .replace(/"/g, "&quot;") // Escape " to prevent XSS
                .replace(/'/g, "&#39;") // Escape ' to prevent XSS
                .replace(/`/g, "&#96;") // Escape ` to prevent XSS
                .replace(/;/g, "") // Remove ; to prevent SQL injection
                .replace(/--/g, "") // Remove -- to prevent SQL injection
                .trim(); // Trim whitespace to prevent obfuscation
        } catch(e) {
            return this.internalServerErrorReturn;
        }
    }
    
}

module.exports = APISecurity;