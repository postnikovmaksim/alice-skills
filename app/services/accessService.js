const trustedDevices = [];

module.exports = {
    validation({session}){
        const isTrustedDevices = trustedDevices.indexOf(session.user_id);
        if (!isTrustedDevices){
            trustedDevices.push(session.user_id);
        }
    }
};