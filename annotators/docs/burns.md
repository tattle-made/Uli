1. in the migration files (eg: XXXX-create-annotation.js), you will see a snippet like 
```javascript
userId: {
    type: Sequelize.UUID,
    allowNull: false,
    references: {
        model: "Users",
        key: "id",
    },
},
```
here in the references object, there is a key called model, you might think that this refers to models in sequelize, but what it really means is the name of the table.
I learnt it [here](https://sequelize.org/master/class/lib/dialects/abstract/query-interface.js~QueryInterface.html#instance-method-createTable)

This is particularly tricky because in sequelize, you name your model something like "User" and when it creates a table, it pluralizes it to Users. so I kept writing "User" in the model field (which is the model name) but what really worked was using the table name ("Users")