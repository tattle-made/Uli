//console.log(`Environment : ${process.env.NODE_ENV}`);

const {
  slur,
  category,
  sequelize,
} = require("../db/models");


console.log(`Inside Slur : ${process.env.NODE_ENV}`);

// GET request for Slur and Category
const getSlur =  async (req, res) => {
  const user = req.user;
  try {
    const results = await slur.findAll({
      where: {
        userId: user.id,
      },
      include: [
        {
          model: category,
          as: "categories",
        },
      ],
    });
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "server error" });
  }
};

// GET request for Slur and Category by slurId 
const getSlurById = async (req, res) => {
  const slurId = req.params.id;
  try {
    const slurMetadata = await slur.findByPk(slurId, {
      include: [
        {
          model: category,
          as: "categories",
        },
      ],
    });
    res.json(slurMetadata);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "server error" });
  }
};

// POST request for slur and category
const createSlur = async (req, res) => {
  const { user } = req;
  const userId = user.id;
  const {
    label,
    levelOfSeverity,
    casual,
    appropriated,
    appropriationContext,
    meaning,
    categories,
  } = req.body;
  console.log(
    userId,
    label,
    meaning,
    appropriated,
    appropriationContext,
    categories
  );
  const t = await sequelize.transaction();

  try {
    const newSlur = await slur.create(
      {
        userId,
        label,
        levelOfSeverity,
        casual,
        appropriated,
        appropriationContext,
        meaning,
      },
      { transaction: t }
    );

    const categoryPromises = categories.map(async (categoryData) => {
      const newCategory = await category.create(
        {
          slurId: newSlur.id,
          category: categoryData,
        },
        { transaction: t }
      );
      return newCategory;
    });

    const createdCategories = await Promise.all(categoryPromises);

    await t.commit();

    res.send({
      slur: newSlur,
      categories: createdCategories,
    });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).send({ error: "server error" });
  }
};

// PUT request for slur and category
const updateSlur = async (req, res) => {
  const slurId = req.params.id;
  const {
    label,
    levelOfSeverity,
    casual,
    appropriated,
    appropriationContext,
    meaning,
    categories,
  } = req.body;
  const t = await sequelize.transaction();

  try {
    const existingSlur = await slur.findByPk(slurId, { transaction: t });
    if (!existingSlur) {
      res.status(404).send({ error: "Slur not found" });
      await t.rollback();
      return;
    }
    // Update the slur record
    existingSlur.label = label;
    existingSlur.levelOfSeverity = levelOfSeverity;
    existingSlur.casual = casual;
    existingSlur.appropriated = appropriated;
    existingSlur.appropriationContext = appropriationContext;
    existingSlur.meaning = meaning;
    await existingSlur.save({ transaction: t });

    // Delete existing categories for this slur
    await category.destroy({
      where: {
        slurId: existingSlur.id,
      },
      transaction: t,
    });

    // Create new categories
    const categoryPromises = categories.map(async (categoryData) => {
      const newCategory = await category.create(
        {
          slurId: existingSlur.id,
          category: categoryData,
        },
        { transaction: t }
      );
      return newCategory;
    });

    const updatedCategories = await Promise.all(categoryPromises);
    await t.commit();

    res.send({
      slur: existingSlur,
      categories: updatedCategories,
    });
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).send({ error: "Server error" });
  }
};

// DELETE request for slur and category
const deleteSlur = async (req, res) => {
  const slurId = req.params.id;
  const t = await sequelize.transaction();
  try {
    const slurToDelete = await slur.findByPk(slurId, { transaction: t });
    if (!slurToDelete) {
      res.status(404).send({ error: "Slur not found" });
      await t.rollback();
      return;
    }

    await category.destroy({
      where: {
        slurId: slurToDelete.id,
      },
      transaction: t,
    });
    await slurToDelete.destroy({ transaction: t });

    await t.commit();

    res.send();
  } catch (error) {
    console.error(error);
    await t.rollback();
    res.status(500).send({ error: "server error" });
  }
};




module.exports = {getSlur , getSlurById , createSlur , updateSlur , deleteSlur}