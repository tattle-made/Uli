export function log(msg, payload, delimiter) {
    if (process.env.NODE_ENV === 'development') {
        if (delimiter) {
            console.log(delimiter);
        }
        if (payload) {
            console.log(msg, payload);
        } else {
            console.log(msg);
        }
        if (delimiter) {
            console.log(delimiter);
        }
    }
}
