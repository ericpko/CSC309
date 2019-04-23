#!/bin/bash
# A testing script for app.js
echo "Testing script for app.js"

rm reservations.json
rm restaurants.json
rm status.json


echo ""
echo ""
echo "----- Testing --addRest -----"
node app.js --addRest "Just Eddies" "Best employees"
node app.js --addRest "Just Eddies" "Best employees"
node app.js --addRest "Red Lobster" "Seafood stuff"
node app.js --addRest "Thai Plate" "Orillia's best thai cuisine"
node app.js --addRest "Sushi on Bloor" "Toronto's best Sushi"


echo ""
echo ""
echo "----- Testing --addResv -----"
node app.js --addResv "Just Eddies" "Mar 17 2019 17:30:00" 2
node app.js --addResv "Just Eddies" "Mar 19 2019 18:30:00" 3
node app.js --addResv "Just Eddies" "Mar 17 2019 17:30:00" 4
node app.js --addResv "Just Eddies" "Mar 17 2019 19:30:00" 4
node app.js --addResv "Thai Plate" "Mar 20 2019 17:30:00" 3
node app.js --addResv "Sushi on Bloor" "Mar 21 2019 17:30:00" 6


echo ""
echo ""
echo "----- Testing --allRest -----"
node app.js --allRest


echo ""
echo ""
echo "----- Testing --restInfo -----"
node app.js --restInfo "Just Eddies"


echo ""
echo ""
echo "----- Testing --allResv -----"
node app.js --allResv "Just Eddies"


echo ""
echo ""
echo "----- Testing --hourResv -----"
node app.js --hourResv "Mar 17 2019 17:00:00"


echo ""
echo ""
echo "----- Testing --checkOff -----"
node app.js --checkOff "Just Eddies"
node app.js --checkOff "Just Eddies"
node app.js --checkOff "Thai Plate"


echo ""
echo ""
echo "----- Testing --addDelay -----"
node app.js --addDelay "Just Eddies" 60


echo ""
echo ""
echo "----- Testing --status -----"
node app.js --status


echo ""
echo ""
echo "----- Testing complete -----"
