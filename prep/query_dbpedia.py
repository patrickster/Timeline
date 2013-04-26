
import re
import time
from SPARQLWrapper import SPARQLWrapper, JSON

PAUSE_LENGTH = 3

# Initialize SPARQLWrapper
sparql = SPARQLWrapper("http://dbpedia.org/sparql")
sparql.setReturnFormat(JSON)

# Base query
query = """
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    SELECT ?person, ?label
    WHERE { 
      ?person dcterms:subject category:%s .
      ?person rdfs:label ?label .
      FILTER ( lang(?label) = 'en' )
    }
"""

# Open output files
birth_file = open("./Data/births.csv", "a")
death_file = open("./Data/deaths.csv", "a")

# Iterate through years
for year in range(-1000, 2012):

  print year

  if year < 0:
    birth_cat = str(abs(year)) + "_BC_births"
    death_cat = str(abs(year)) + "_BC_deaths"
  else:
    birth_cat = str(year) + "_births"
    death_cat = str(year) + "_deaths"

  birth_query = query % birth_cat
  death_query = query % death_cat

  # Get births for current year
  sparql.setQuery(birth_query)
  results = sparql.query().convert()
  for result in results["results"]["bindings"]:
    try:
      person = result["person"]["value"]
      label = result["label"]["value"]
      row = '"' + person + '","' + label + '","' + str(year) + '"\n'
      row = row.encode("utf-8")
      birth_file.write(row)
    except:
      print "problem with " + str(result)

  time.sleep(PAUSE_LENGTH)

  # Get deaths for current year
  sparql.setQuery(death_query)
  results = sparql.query().convert()
  for result in results["results"]["bindings"]:
    try:
      person = result["person"]["value"]
      label = result["label"]["value"]
      row = '"' + person + '","' + label + '","' + str(year) + '"\n'
      row = row.encode("utf-8")
      death_file.write(row)
    except:
      print "problem with " + str(result)

  time.sleep(PAUSE_LENGTH)

# Close files
birth_file.close()
death_file.close()


