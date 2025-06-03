import fs from "node:fs";
import path from "node:path";
import { Args, Flags } from "@oclif/core";
import type { Abi } from "abitype";
import { type DecodeFunctionDataReturnType, decodeFunctionData } from "viem";
import { BaseCommand, bigIntReplacer } from "../../base.js";

export default class AbiDecode extends BaseCommand {
  static override summary = "Decode the result of a contract call";
  static override description = "Decode the result of a contract call";

  static flags = {
    path: Flags.string({
      char: "p",
      description: "Path to ABI file",
      required: true,
    }),
  };

  static args = {
    data: Args.string({
      name: "data",
      required: true,
      description: "Method data",
    }),
  };

  static override examples = ["<%= config.bin %> <%= command.id %>"];

  public async run(): Promise<DecodeFunctionDataReturnType> {
    const { flags, args } = await this.parse(AbiDecode);

    const abiPath = flags.path;
    const abiFullPath = path.resolve(abiPath);
    const abiFileContent = fs.readFileSync(abiFullPath, "utf8");
    const abi: Abi = JSON.parse(abiFileContent);

    const data = decodeFunctionData({
      abi: abi,
      // @ts-ignore
      data: args.data,
    });
    this.log(JSON.stringify(data, bigIntReplacer));
    return data;
  }
}
