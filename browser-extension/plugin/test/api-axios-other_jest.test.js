const {
    registerNewUser,
    getPreferenceForUser,
    savePreference,
    resetAccount
} = require('./api-axios-test');

describe('Test Api axios functions apart from Slur Crowdsource', () => {
    it('test axios', async () => {
        
        const response = await registerNewUser();
        expect(response.status).toBe(200);

        const { data } = response;
        const { user } = data;
        const { accessToken } = user;

        const dataPreference = 'data-preference-key'
        const responseSavePreference = await savePreference(
            accessToken,
            dataPreference
        );
        expect(responseSavePreference.status).toBe(200);

        const responseResetAccount = await resetAccount(accessToken);
        expect(responseResetAccount.status).toBe(200);
    });
});
