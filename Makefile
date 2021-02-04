script:
	node bin/\getCloseDebtTransaction.js > output

sql:
	node bin/\getTransactionIdByCardId.js > output

card:
	node bin/\getCardIdByTransactionId.js > output

driver:
	node bin/\addDriver.js > output.csv

diff:
	node bin/\diff.js > output

awk:
	cat input | awk '{ print $$3 }' > output
	
push:
	git push -u origin main

test:
	npx jest --colors
		
.PHONY: test