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


2. EMOJI SUPPORT IN MYSQL DATABASE
Ensure that your database has utf8mb4 for its fields. We made this mistake a few times when setting up 
new databases. This can result in emojis not getting stored correctly in the db. For this project, its crucial for emojis to be preserved for annotations.
I followed this SO [answer](https://stackoverflow.com/a/38363567/2767642)
tldr : best practice to store emojis is to have character set as `utf8mb4` and collation as `utf8mb4_unicode_520_ci`