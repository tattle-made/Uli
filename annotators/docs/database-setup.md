```
npx sequelize-cli model:generate --name User --attributes role:ENUM:'{admin,editor,annotator}',username:STRING,password:STRING,lang:ENUM:'{hi,en,ta}'

npx sequelize-cli model:generate --name Post --attributes role:ENUM:'{text,image}',text:STRING,url:STRING

npx sequelize-cli model:generate --name Annotation --attributes postId:string,key:string,value:string,userId:string

npx sequelize-cli model:generate --name UserPostAllocation --attributes userId:string,postId:string,status:enum:'{pending,completed,corrupt}'
```