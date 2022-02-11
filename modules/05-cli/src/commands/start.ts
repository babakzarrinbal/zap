import type { Arguments, CommandBuilder } from 'yargs'
const {LegecyStartUp,LegecyEnv} = require('@zzapp/core')
// import profile from "@src/profiles";
type Options = {
  // id: number;
};


export const command = 'start'
export const desc = 'start maininstance server'
// export const builder: CommandBuilder<Options, Options> = (yargs) =>
  // yargs
    // .options({
    //   create: { type: 'number' ,default:1,  demandOption: false },
    // })
    // .positional('id', { type: 'number', demandOption: false, default:1});

export const handler = async (argv: Arguments<Options>) => {
  process.argv.slice(3)
  LegecyEnv.setDevelopmentEnv();
  argv.zclProperties = "Z:\\02-sible\\zap.v2_forked\\test\\resource\\meta\\zcl.json" || LegecyEnv.builtinSilabsZclMetafile();
  LegecyStartUp.startUpMainInstance(false,argv)
  // const greeting = `Hello, ${name}!`;
  // process.stdout.write(upper ? greeting.toUpperCase() : greeting);
  // process.exit(0);
};