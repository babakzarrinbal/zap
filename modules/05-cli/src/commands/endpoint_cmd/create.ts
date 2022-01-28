import type { Arguments, CommandBuilder } from 'yargs'
const {endPoint} = require('@zzapp/core')
import profile from "@src/profiles";
type Options = {
  id: number | undefined
  file: string | undefined
}

export const command = 'create'
export const desc = 'print endpoint info '
export const builder: CommandBuilder<Options, Options> = (yargs) =>
  yargs.options({
    id: { type: 'number', demandOption: false },
    file: { type: 'string', alias: 'f', demandOption: false },
  })
// .positional('id', { type: 'number', demandOption: false});

export const handler = async (argv: Arguments<Options>) => {
  console.log(await endPoint.create(profile.db.path))
  // const { name, upper } = argv;
  // const greeting = `Hello, ${name}!`;
  // process.stdout.write(upper ? greeting.toUpperCase() : greeting);
  // process.exit(0);
}
