script:
	node bin/\getCloseDebtTransaction.js > output

sql:
	node bin/\getSqlQueries.js > output

awk:
	cat input | awk '{ print $$3 }' > output
	
push:
	git push -u origin main
