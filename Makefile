script:
	node src/\getCloseDebtTransaction.js > output

sql:
	node src/\getSqlQueries.js > output

awk:
	cat input | awk '{ print $$3 }' > output
