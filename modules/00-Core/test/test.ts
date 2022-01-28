import  {endPoint} from "@src/index";
(async function() {
  const e = await endPoint.getOne("./sqlite.sqlite",1)
  console.log('test',e)
  // console.log(await endPoint.create(database))
  // const newId = await queryEndpoint.insertEndpoint(
  //   database,1,1,1,1,1,1,1
  // )
  // console.log(await queryEndpoint.selectEndpoint(database,newId))
})()