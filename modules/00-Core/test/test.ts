import  {DB,endPoint} from "@src/index";
import path from "path";
console.log();
(async function() {

  const database = await DB.initDatabase(path.resolve('./test/.mockdata/testdb.sqlite'))
  // console.log(await endPoint.create(database))
  console.log(await endPoint.getOne(database,1))
  // const newId = await queryEndpoint.insertEndpoint(
  //   database,1,1,1,1,1,1,1
  // )
  // console.log(await queryEndpoint.selectEndpoint(database,newId))
})()