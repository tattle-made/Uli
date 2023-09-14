const { slur, category } = require("./db/models");

// delete category
// create slur
async function createSlur() {
    try {
        await slur.create({
            label: "test",
            labelMeaning: "test",
            appropriated: false,
            appropriationContext: "test",
        })
    } catch (error) {
        console.log(error);
    }
}

// create category
async function createCategory() {
    try {
        await category.create({
            slurId: '5673724e-741b-4e68-ba9f-cb5142da20c8',
            category: 'gender',
        });
    } catch (error) {
        console.error(error);
    }
}

// create slur AND category
// async function createSlurAndCategory() {
//     try {
//         await slur.create({
//             label: "test2",
//             labelMeaning: "test2",
//             appropriated: true,
//             appropriationContext: "test2",
//             category: {category:'gender'}
//             },{
//                 include: [{
//                     association: category
//                 }]
//             })
//     } catch (error) {
//         console.log(error);
//     }
// }

// Transactions
async function createSlurAndCategory() {
    try {
        const newSlur = await slur.create({
            label: "test2",
            labelMeaning: "test2",
            appropriated: true,
            appropriationContext: "test2",
        });

        await category.create({
            slurId: newSlur.id,
            category: 'gender',
        });
    } catch (error) {
        console.log(error);
    }
}

//update slur
async function updateSlur() {
    try {
        await slur.update({
            label: "test_update",
        }, {
            where: { id: '5673724e-741b-4e68-ba9f-cb5142da20c8' }
        })
    } catch (error) {

    }
}

//update category
async function updateCategory() {
    try {
        await category.update({
            category: "caste",
        }, {
            where: { id: 'd98e7cf5-5510-48fd-b5e3-73b949751e5e' }
        })
    } catch (error) {
        console.log(error);
    }
}

// make a delete category function as well

// delete slur
async function deleteSlurAndCategory() {
    try {
        await category.destroy({
            where: { slurId: '5673724e-741b-4e68-ba9f-cb5142da20c8' }
        });
        await slur.destroy({
            where: { id: '5673724e-741b-4e68-ba9f-cb5142da20c8' }
        });
    } catch (error) {
        console.log(error);
    }
}

(async function test() {
    try {
        // await createSlur();
        // await createCategory();
        // createSlurAndCategory();
        // await updateSlur();
        // await updateCategory();
        await deleteSlurAndCategory();
    } catch (error) {
        console.log(error);
    }
})();