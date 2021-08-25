SRC = fcomp.ts
ABS := $(abspath $(lastword $(MAKEFILE_LIST)))
CWD := $(dir $(ABS))

install: format compile symlink ## Build from source and create symlink

build: format compile ## Format and compile source 

format:  ## Format the source code
	@echo "Formating source"
	deno fmt ${SRC}

compile: ## Compile source to an executable
	@echo "Compiling source"
	deno compile --allow-read ${SRC}

test: clean generate run ## Cleans up, generate test files, runs test

generate: ## Generate test dirs and files
	@echo "Creating test files..."
	mkdir source target
	cd source && touch file-{1..10}.txt
	cd target && touch file-{1..5}.md

clean: ## Deletes test dirs and files
	@echo "Cleaning up..."
	rm -rf source target

run:
	@echo "Running with common params (-i -p -m in)"
	deno run --allow-read ${SRC} -s source -t target -i -p

symlink:
	@echo "Creating symlink in /usr/local/bin"
	ln -s ${CWD}fcomp /usr/local/bin/

help:
	@grep -E '(^[a-zA-Z_\.@-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | sed -e 's/Makefile://' | awk 'BEGIN {FS = ":.*?## "}{printf "\033[32m%-30s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m##/[33m/'