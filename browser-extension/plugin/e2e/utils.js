async function sleep(ms) {
    return await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, ms);
    });
}

module.exports = { sleep };
