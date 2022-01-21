import fs from 'fs'
import path from 'path'
import * as db from '@src/db/db-api'

/**
 *
 * @param {string} dbpath path of sqlite file
 */
export async function initDatabase(dbpath: string) {
  // TODO creating in memory db
  // if(!dbpath.replace(/\\/g,"/").includes("/")){

  // }

  //create or connect to file db
  if (!fs.existsSync(dbpath)) {
    fs.writeFileSync(dbpath, '')
    return await db.initDatabaseAndLoadSchema(
      dbpath,
      path.join(__dirname, '../db/zap-schema.sql'),
      {}
    )
  }else{
    return await db.initDatabase(dbpath)
  }
}
