import queryEndpoint from '@src/db/query-endpoint.js';
const validation = require('@src/validation/validation.js')

interface endpoint {
  id?: number
  sessionId?: number
  endpointId?: number
  networkId?: number
  profileId?: number
  endpointType?: number
  endpointVersion?: number
  deviceIdentifier?: number
}

/**
 *
 * @param {object} db instance of database
 * @param {endpoint} endpointinfo  instance of endpoint type
 */
export async function create(db: object, endpointinfo: endpoint={}) {
  const newId = await queryEndpoint.insertEndpoint(
    db,
    endpointinfo.sessionId,
    endpointinfo.endpointId,
    endpointinfo.endpointType,
    endpointinfo.networkId,
    endpointinfo.profileId,
    endpointinfo.endpointVersion,
    endpointinfo.deviceIdentifier
  )
  const validationData = await validation.validateEndpoint(db, newId)
  return {
    id: newId,
    endpointId: endpointinfo.endpointId,
    endpointType: endpointinfo.endpointType,
    networkId: endpointinfo.networkId,
    deviceId: endpointinfo.deviceIdentifier,
    profileId: endpointinfo.profileId,
    endpointVersion: endpointinfo.endpointVersion,
    validationIssues: validationData,
  }
}

/**
 * 
 * @param {object} db instance of database
 * @param {number} endpointId id of endpoint in database
 */
export async function getOne(db: object,endpointId:number){
 return await queryEndpoint.selectEndpoint(db,endpointId)
}