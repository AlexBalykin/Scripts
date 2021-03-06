install: install-deps

install-deps:
	npm ci

lint:
	npx eslint .

debt:
	node bin/\getCloseDebtTransaction.js > output

sql:
	node bin/\getTransactionIdByCardId.js > output

query:
	node bin/\getQuery.js > output

driver:
	node bin/\addDriver.js > output.csv

term:
	node bin/\addTerminal.js > output.csv

diff:
	node bin/\diff.js > output

sha:
	node bin/\sha.js > output	

parse:
	node bin/\json.js > output
	
push:
	git push -u origin main

awk:
	cat input | awk '{ print $$3 }' > output

test:
	npx jest

test-coverage:
	npm test -- --coverage --coverageProvider=v8