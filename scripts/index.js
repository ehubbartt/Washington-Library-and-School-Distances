mapboxgl.accessToken =
  "pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw";

const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/light-v10", // style URL
  zoom: 6.5, // starting zoom
  center: [-120.7, 47.5], // starting center
});

const geoJsonFetch = async () => {
  const libraryResponse = await fetch(
    "../assets/data/Cleaned_Washington_Library_Locations.geojson"
  );
  const libraryData = await libraryResponse.json();

  const schoolResponse = await fetch(
    "../assets/data/Cleaned_Washington_State_Public_Schools.geojson"
  );
  const schoolData = await schoolResponse.json();

  const countyResponse = await fetch(
    "../assets/data/Washington_Counties_(no_water).geojson"
  );
  const countyData = await countyResponse.json();

  map.on("load", () => {
    map.addSource("library_data", {
      type: "geojson",
      data: libraryData,
    });

    map.addLayer({
      id: "library_data",
      type: "circle",
      source: "library_data",
      paint: {
        "circle-radius": 2,
        "circle-color": "#007cbf",
      },
    });

    map.addSource("school_data", {
      type: "geojson",
      data: schoolData,
    });

    map.addLayer({
      id: "school_data",
      type: "circle",
      source: "school_data",
      paint: {
        "circle-radius": 2,
        "circle-color": "#ff0000",
      },
    });

    map.addSource("county_data", {
      type: "geojson",
      data: countyData,
    });

    map.addLayer({
      id: "county_data",
      type: "fill",
      source: "county_data",
      paint: {
        "fill-color": "#000000",
        "fill-opacity": 0.1,
      },
    });
  });
};

geoJsonFetch();
