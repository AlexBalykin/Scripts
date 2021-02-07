debt:
	node bin/\getCloseDebtTransaction.js > output

sql:
	node bin/\getTransactionIdByCardId.js > output

query:
	node bin/\getQuery.js > output

driver:
	node bin/\addDriver.js > output.csv

diff:
	node bin/\diff.js > output
	
push:
	git push -u origin main

test:
	npx jest --colors
		
.PHONY: test