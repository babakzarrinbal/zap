import type { Arguments, CommandBuilder } from 'yargs'
const {endPoint} = require('@zzapp/core')
import profile from "@src/profiles";
type Options = {
  id: number;
};


export const command = 'get <id>'
export const desc = 'print endpoint info '
export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs
    // .options({
    //   create: { type: 'number' ,default:1,  demandOption: false },
    // })
    .positional('id', { type: 'number', demandOption: true});

export const handler = async (argv: Arguments<Options>) => {
  const { id } = argv;
  console.log(await endPoint.getOne(profile.db.path,id))
  // const greeting = `Hello, ${name}!`;
  // process.stdout.write(upper ? greeting.toUpperCase() : greeting);
  // process.exit(0);
};
