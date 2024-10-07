function fixCapitalization(name) {
    if (needToFixCapitalization(name)) {
        return capitalize(name);
    }
    return name;
}

function needToFixCapitalization(name) {
    if (isAllLowerCase(name)) { return true; }
    if (isAllUpperCase(name)) { return true; }
}

function capitalize(name) {
    const parts = name.split(' ');
    
    const capitalizedItems = [];
    
    for(let part of parts) {
        const lowerCase = part.toLowerCase();
        const fLetter = lowerCase.slice(0, 1).toUpperCase();
        const rletters = lowerCase.slice(1, lowerCase.length);
        const finalName = fLetter + rletters;
        
        capitalizedItems.push(finalName);
    }
    
    const capitalized = capitalizedItems.join(' ');
    
    return capitalized;
}
    
function isAllLowerCase(str) {
    for (let i = 0; i < str.length; i++) {
        if (!isLowerCaseChar(str, i)) {
        return false;
        }
    }
    return true;
}
    
function isAllUpperCase(str) {
    for (let i = 0; i < str.length; i++) {
        if (!isUpperCaseChar(str, i)) {
        return false;
        }
    }
    return true;
}
    
function isLowerCaseChar(str, index = 0) {
    let char = str.charAt(index);
    return (char === char.toLowerCase());
}
    
function isUpperCaseChar(str, index = 0) {
    let char = str.charAt(index);
    return (char === char.toUpperCase());
}

exports.fixCapitalization = fixCapitalization;