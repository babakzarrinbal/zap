const  {DB,endPoint} = require( "@zzapp/core");
import path from "path";
(async function() {

  const database = await DB.initDatabase(path.resolve('../00-core/test/.mockdata/testdb.sqlite'))
  // console.log(await endPoint.create(database))
  console.log(await endPoint.getOne(database,1))
  // const newId = await queryEndpoint.insertEndpoint(
  //   database,1,1,1,1,1,1,1
  // )
  // console.log(await queryEndpoint.selectEndpoint(database,newId))
})()