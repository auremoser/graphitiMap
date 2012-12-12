Graphiti Project - NYC Graffiti Data Map Edition (part 2 of 3)
============================

CartoDB and Leaflet powered map that visualizes NYC graffiti data distribution in the 5 boroughs (see also graphitiTime).

The original data set can be accessed via the NYC socrata open data portal.

Files in the repo represent the javascript, css/markup for a CartoDB wrapper using Leaflet, Stamen and Colorbrewer to presenting the final mapping visualization from NYC data.

Further explanation can be found in the step-by-step below.

View the project as rendered on this git page: [http://auremoser.github.com/graphitiMap](http://auremoser.github.com/graphitiMap)

Description
===========
From the NYC.gov open data portal, I selected a dataset logging the location of graffiti incidences in the 5 boroughs (including address, borough, community board, police precinct, city council district, bizarre x y coordinates). The CSV that I exported and then loaded into CartoDB was used to map incidents of graffiti logged by points as well as regional density. With regions defined by nynta shapefiles for neighboorhoods, I created a choropleth map that illustrated the concentration of graffiti incidents per neighborhood by color, and then a menu toggle for another view representing each incident as a point, colored according to borrough and whether or not the incident was open or closed (in this case meaning clean). Wrapping this in JS using code with Leaflet allowed me to render it in a browser and add address search functionality as well as zooming. 

Usage
===========
As with the graphitiTime repo, my procedure for data cleaning and preparation as well as the stack detailed below could apply to other NYC gov datasets as accessed through socrata and visualized as a map. Preparing to rectify nyc data xy s to usable lat longs alone is worth a description.

Procedure
===========
### Generating Geom ###
I wanted to map the Graffiti data records from my 2010-2012 data set to see if plotting the points would tease out additional information about these data. After fumbling in QGIS, I did some research and decided to use CartoDB, a tool for data analysis, mapping, and developing applications. Creating an account, I was able to load in my CSV as a table, and then execute SQL queries to generate a new geom (geometric projection) from the x/y coordinates listed in the spreadsheet. To do this I had to research some of the projection numbers that would be appropriate to transform the x/y into geometries, set them to the SRID measurement, and then transform them to the standard projection for the geom with NY as a coordinate hub.

UPDATE graffiti_locations SET the_geom = ST_Transform(ST_SetSRID(ST_MakePoint(x_coordinate, y_coordinate),2263),4326)

![Generating Geom] (https://raw.github.com/auremoser/images/master/geom.png)

### Plotting ###
After this I was able to generate a map, plotting the points of all table entries in my table. For styling, I edited color specifications to distinguish between boroughs (colored according to last week’s borough charts) and open/closed (‘closed’ indicated by the light gray dots). CartoDB uses a CSS language called Carto so I edited the styling and then exported the map as a shape file to prepare for importing it into an webapp. The final application is built on a cartodb, leaflet css (for more stylistic finess) and javascript with underscore.js (allowing for easy backbone.js pairing).

![NYNTA Regions and Shape Files] (https://raw.github.com/auremoser/images/master/nyta.png)

### Styling ###
For the final product, I created another table in carto db of the shape files for nynta [neighborhood tabulation areas] (http://www.nyc.gov/html/dcp/html/bytes/meta_nynta.shtml) to get approximation of neighborhood boundaries. I then added a column “count_g” that calculated all of the incidents per nta and edited the carto css to reflect the relative density of graffiti tags (the count_g) per neighborhood, as a choropleth map. Rendering was a little complicated, I used fusion tables to select an appropriate zoom level and borrowed their lat/long for the projection and orientation as the map loaded. Functions in a js app correspond to an html page that would display both maps with the option to toggle between polygon choropleth counts, and the point level indications of incidents and their status as open/closed. The hover function displays a model that either indicates #count and neighborhood name (polygon map) or open/closed status and street level address. The key in the upper right corner allows you to toggle between map views and understand what the gradations in the choropleth indicate in terms of actual incident numbers; as well as which boroughs the colors correspond to in the incident map. A search bar also allows the user to pinpoint particular addresses and determine the relative proximity of tag clusters. 

![Incident Map] (https://raw.github.com/auremoser/images/master/graphitiMapincidents.png)

### Analysis ###
By mapping the same data, we add a localization dimension to the same information; geographic density of the tags tells us which neighborhoods are most populated by tags via choropleth and which where clusters of tags exist in particular boroughs via incident point map. From the choropleth map, we can deduce that Washington Heights and Chinatown are the most densely documented neighborhoods for all boroughs, but the most dense swaths localize to the darkest regions corresponding to the sum of a few adjacent neighborhoods, mostly in Queens, Bushwick and northeast Brooklyn. When toggled to the incident map, points of incidents are color-coded according to the borough as indicated in the legend if still “open” or “uncleaned” cases; cleaned cases are indicated as grey points (more “effaced” than their “open” counterparts. The significant density of grey in lower Manhattan and comparative dominance of brighter colors in the other boroughs suggests that a majority of cleanup attention is devoted to Manhattan (which is confirmed in the previous week’s graph data. 

![Region Map] (https://raw.github.com/auremoser/images/master/graphitiMap.png)
