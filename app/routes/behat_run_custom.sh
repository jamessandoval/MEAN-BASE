#!/bin/bash

###                                                            ####
### Obtain the feature source to generate additional features  ####
###                                                            ####

featureInput="base-features/ca1_base.feature"

###                                                            ###
### Obtain the source urls to test                             ###
###                                                            ###


###
### Build Input File
###


### Read from all input files to get single input

###


## Example :: 

linkInput=$1


#linkInput="inputFiles/development/recalled.txt"

##
## Parse out relevant paths to input and output correct file locations
##

fPath=${featureInput%%_*}
fPath=${fPath##*/}

mkdir "report_output/$fPath"
mkdir "features/$fPath/"

testOutput="report_output/"$fPath"/output.txt"
featureFolder="features/$fPath/"
tmpFolder=$featureFolder"tmp/"

##
## Define the Domain Here:
##

domain="https://live-igcommerce.pantheonsite.io/"

##
## Output Building Features
##

echo "Building Features...based on "$featureInput

##
## Obtain the Time and Date stamp
##

timestamp() {
  date +"%T"
}

datestamp(){ 
 date +"%Y%m%d"
}

# Clean up the features Directory:
rm -rf $featureFolder

##
## create custom tmp folder for specific feature
##

mkdir $featureFolder

mkdir $tmpFolder
tmp=$tmpFolder"tmp"
touch $tmp

## Read each url and create new files
## Each file is named using the url Path
## Each file url is changed according to path

#Create a unique id for each scenario

#Initialize Language locale to null
#Inititalize Type Locale to null
langLocaleCheck=""
typeLocaleCheck=""

# Incremental value used to determine id for type locale
id_inc=3000

#
# Create feature files based on provided URLS
#

while IFS= read -r url
do

  # strip path from url
  path=${url##*io/}
  path=$(echo $path | sed -e 's/\//\\\//g')

  #Obtain Language locale from url
  langLocale=${url##*io/}
  langLocale=${langLocale%%/*}

  #obtain type Locale from Url
  typeLocale=${url##*io/}
  typeLocale=${url##*/}

  #echo $langLocale
  #echo $typeLocale
  
  newFilename=${url##io*}
  newFilename=$(echo $newFilename | sed -e 's/\//_/g')
  newFilename=${newFilename##*io_}

  # Add id to the file name
  #newFilename="id"$id_inc"_"$newFilename

  #echo "the argument is: "$1;
  #echo "the language locale is: "$langLocale;

  echo "New file created: "$newFilename;

  sed 's/Given I am on ".*/Given I am on '"\"$path\""'/g' $featureInput > $tmp; mv $tmp $featureFolder${newFilename}.feature
  sed 's/Feature: .*/Feature: '$path'/g' $featureFolder${newFilename}.feature > $tmp; mv $tmp $featureFolder${newFilename}.feature

 
done < "$linkInput"

# Create output file and call behat to run tests
touch $testOutput

echo "Behat Tests Running..."

vendor/bin/behat "$featureFolder" -p phantomjs #> $testOutput

#less -R $testOutput

# Process output starts here

##########################
# OUTPUT TO TEXT FILES
##########################

time=$(timestamp)
date=$(datestamp)

outputTXT="TXT_TEST_"$fPath"-"$date"-"$time".txt"

outputTXT=$(echo $outputTXT | sed -e 's/:/-/g')

touch report_output/"$fPath"/$outputTXT

outputTXT="report_output/$fPath/$outputTXT"

cp $testOutput $outputTXT

##
## Cleanup directories 
## 

rm $testOutput


# Clean up the features Directory:
rm -rf $featureFolder

mkdir $featureFolder

echo "$fPath Behat test complete"
## EOF 
