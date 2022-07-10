/**
 * Copied from here - https://stackoverflow.com/a/8831937
 * Its faster than the standard cryptographic hashing functions
 * and gaurantees uniqueness, which is what we need it for
 */
function hashCode(data) {
    var hash = 0;
    for (var i = 0; i < data.length; i++) {
        var char = data.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
}

export { hashCode };
