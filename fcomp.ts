import { parse } from "https://deno.land/std/flags/mod.ts";
import * as Colors from "https://deno.land/std/fmt/colors.ts";

const parsedArgs: any = parse(Deno.args);
const usageNotice: string = `
USAGE 
    fcomp [options] -s [source-path] -t [target-path]
    
OPTIONS
    -s  <source> directory
    -t  <target> directory
    -m  <method> used to compare directories (in, out, duplicates)
    -i  <ignore> files extension, compare filenames only
    -p  <pretty> print each result on a new line

META OPTIONS
    -h show all options
`;

if (!parsedArgs.s || !parsedArgs.t || parsedArgs.h) {
  console.log(usageNotice);
  Deno.exit(1);
}

interface Options {
  sourceDir: string;
  targetDir: string;
  method: string;
  ignoreExt: boolean;
  prettyPrint: boolean;
}

const options: Options = {
  sourceDir: parsedArgs.s,
  targetDir: parsedArgs.t,
  method: parsedArgs.m || "in",
  ignoreExt: parsedArgs.i || false,
  prettyPrint: parsedArgs.p || false,
};

// Create empty Arrays that will contain source/files
let sourceFiles: string[] = [];
let sourceFilesNoExt: string[] = [];
// Create empty Arrays that will contain target/files
let targetFiles: string[] = [];
let targetFilesNoExt: string[] = [];

for await (const item of Deno.readDir(options.sourceDir)) {
  if (item.isFile) {
    sourceFiles.push(item.name);
  }
}

for await (const item of Deno.readDir(options.targetDir)) {
  if (item.isFile) {
    targetFiles.push(item.name);
  }
}

// Create new arrays without file extensions if the -i param was passed
if (options.ignoreExt) {
  sourceFilesNoExt = sourceFiles.map((filename) => filename.split(".")[0]);
  targetFilesNoExt = targetFiles.map((filename) => filename.split(".")[0]);
}

let results: string[] = [];

if (options.method === "in") {
  // Print which method will be used
  console.warn(
    Colors.blue(
      `Files that are in ${options.sourceDir} but not in ${options.targetDir}:`,
    ),
  );
  results = sourceFiles.filter((file) => {
    let isIn: boolean = false;
    if (options.ignoreExt) {
      isIn = !targetFilesNoExt.includes(file.split(".")[0]);
    } else {
      isIn = !targetFiles.includes(file);
    }
    return isIn;
  });
} else if (options.method === "out") {
  // Print which method will be used
  console.warn(
    Colors.blue(
      `Files that are in ${options.targetDir} but not in ${options.sourceDir}:`,
    ),
  );

  results = targetFiles.filter((file) => {
    let isIn: boolean = false;
    if (options.ignoreExt) {
      isIn = !sourceFilesNoExt.includes(file.split(".")[0]);
    } else {
      isIn = !sourceFiles.includes(file);
    }
    return isIn;
  });
} else {
  // Print which method will be used
  console.warn(Colors.blue("Files that are in both directories (duplicates):"));

  results = sourceFiles.filter((file) => {
    let isIn: boolean = false;
    if (options.ignoreExt) {
      isIn = targetFilesNoExt.includes(file.split(".")[0]);
    } else {
      isIn = targetFiles.includes(file);
    }
    return isIn;
  });

  results = sourceFiles.filter((file) => targetFiles.includes(file));
}

// Finally print the results
if (options.prettyPrint) {
  let sortedResults: string[] = results.sort((a, b) => {
    if (a > b) {
      return 1;
    }
    if (a < b) {
      return -1;
    }
    return 0;
  });
  for (let result of sortedResults) {
    console.log(result);
  }
} else {
  console.log(results.join(" "));
}
