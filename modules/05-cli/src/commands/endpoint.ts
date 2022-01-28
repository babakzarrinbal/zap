import type {  CommandBuilder } from 'yargs'
export const command = 'endpoint <command>'
export const desc = 'EndPoint related actions '

export const builder: CommandBuilder = (yargs) =>
  yargs.commandDir('endpoint_cmd',{
    extensions: ['js',"ts"],
  })