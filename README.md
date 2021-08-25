# Fcomp - compare files

This is a small utility written in typescript/deno that helps you find files that are in a folder A but not in a folder B, or the other way round. With the `-m duplicates` parameter, you can also find duplicates.

I swear it's useful. At least for myself...

## Installation

- [Install deno](https://deno.land/#installation)
- Clone this repository with `git clone git@github.com:bnthor/fcomp.git` in your $HOME
- Get into the folder with `cd fcomp`
- Install the utility with `make install` (creates a symlink)

## Usage 

Run the command like so: `fcomp [options] -s [source-path] -t [target-path]`

For example, `fcomp -p -i -s sourceDir -t targetDir` will print files that are **in** the sourceDir but **not in** the targetDir. It will ignore the file extension and only compare the filenames (hence the `-i` param).

```sh
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
```

## Comparison methods

It describes the method used to compare files, and can be one of these:

- `-m in`:  (default) finds files that are **in** the _source dir_ **but not in** the _target dir_
- `-m out`:  finds files that are **in** the _target dir_ **but not in** the _source dir_
- `-m duplicates`:  finds files that are **in** the _source dir_ **and also in** the _target dir_
