# Final-Project: Schools and Libraries in Washington GIS Application

### *Project title:*
Visualizing public schools and public libraries in Washington State by County level

### *Project description:*
This web GIS application is designed to display a map that shows varioous locations of public schools and public libraries in Washington state using Mapbox GL JS. With county layer, users can sort by distance. There are total 2,552 schools and 643 libraries in Washington state and each icon represents either school or library. Each location will show the location name with county.

### *Project goal:*
This map allows users to be able to locate all the public schools and public libraries in WA state as well as see which library or school  belongs to which county. Then the goal of this project is to illustrate where some schools might have disadvantages based on how mnay public libraries are near them and may be draw which county has the greatest access to libraries for students and vice versa. By doing so, this map can be useful for state legislators to devise possible education-related policy for certain counties for a better opportunities to grow.

### *The application URL (not the repo url):*

### *Screenshots:*

### *Main functions:*
> Build listings function  - buildLocationList(): Build a list for each school and libraryto the side bar. It iterates through the libraries and shcools location and add each one to the sidebar listing dynamically. The listings will populate the sidebar on the left side of the page.
>
> Interactivity functions - flyTo() & createPopup(): flyTo() center the map on the correct location and zoom in while createPopup() display a popup at that same location.

### *Data sources:*
The datasets come from [Washington Geospatial Open Data Portal](https://geo.wa.gov/), where it provides efficient, effecive, and transparent dataset.
The datasets originally contain 2,552 records of public schools and 643 records of public libraries in Washington state with various download options including CSV, Shapefile, GeoJSON, and File Geodatabase.

### *Applied libraries and Web Services in use:*
The applied libraries in used for this web GIS application is Mapbox GL JS, Mapbox Studio, and Mapbox Street Style for a base map and thematic map layers.Web service used to publish our project publicly is through Github.

### *Acknowledgment:*
-Bo Zhao: provided eseential concepts needed to build web GIS application
-Steven Bao: helped debugging erros both technically and documentally
-[Washington Geospatial Open Data Portal](https://geo.wa.gov/): provided cleaned, credible datasets
-[Mapbox](https://docs.mapbox.com/): provided a template as a reference

### *Extra information:*
We used [Build a store locator](https://docs.mapbox.com/help/tutorials/building-a-store-locator/#finished-product) as a reference. The series of tutorials teach you how to create a store locator using Mapbox GL JS then sort the sotres by their distance from a given location using the Mapbox GL Geocoder plugin and TUrf.js. Basically it has two big parts: 1. Build a store locator 2. Sort stores by distance

#### This description must be no less than 800 words. In the repository, please describe the web map.Your readme.md file should be well-formatted and free of grammatical errors (3pts)
