const {
    registerNewUser,
    createSlurAndCategory,
    updateSlurAndCategory,
    deleteSlurAndCategory,
    getSlurAndCategory
} = require('./api-axios-test');

describe('Slur Crowdsource', () => {
    it('test CRUD operations for slur crowdsourcing', async () => {
        const response = await registerNewUser();
        expect(response.status).toBe(200);
        const { data } = response;
        const { user } = data;
        const { accessToken } = user;

        const slurData = {
            label: 'test1-jest',
            levelOfSeverity: 'high',
            casual: true,
            appropriated: true,
            appropriationContext: false,
            meaning: 'test1-jest',
            categories: ["gendered", "ethnicity"]
        };

        const responseSlurPost = await createSlurAndCategory(
            accessToken,
            slurData
        );
        expect(responseSlurPost.status).toBe(200);
        const { data: createSlurData } = responseSlurPost;
        const { slur: createdSlur } = createSlurData;

        const updatedSlurData = {
            label: 'test1-jest-update',
            levelOfSeverity: 'low',
            casual: true,
            appropriated: false,
            appropriationContext: true,
            meaning: 'test1-jest-update',
            categories: ["caste"]
        };

        const updateSlurResponse = await updateSlurAndCategory(
            accessToken,
            createdSlur.id,
            updatedSlurData
        );
        expect(updateSlurResponse.status).toBe(200);
        const { data: editSlurData } = updateSlurResponse;
        const { slur: editedSlur } = editSlurData;

        const deleteSlurResponse = await deleteSlurAndCategory(
            accessToken,
            editedSlur.id
        );
        expect(deleteSlurResponse.status).toBe(200);

        const fetchSlurResponse = await getSlurAndCategory(accessToken);
        expect(Array.isArray(fetchSlurResponse)).toBe(true);
        expect(fetchSlurResponse.length).toBe(0);
    });
});
