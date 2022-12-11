window.addEventListener("load", () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/mapbox/light-v10", // style URL
    zoom: 6.5, // starting zoom
    center: [-120.7, 47.5], // starting center
  });

  const layers = ["school_data", "library_data", "county_data"];
  const DOT_SIZE = 3;

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

    const libraryDataContainer = document.getElementById(
      "library_data_container"
    );
    const libraryFeatures = libraryData.features;
    for (const feature of libraryFeatures) {
      let dataItem = document.createElement("div");
      dataItem.classList.add("data-item");
      dataItem.classList.add("btn");

      dataItem.innerHTML = `
        <div class="data-item__title">${feature.properties.Library}</div>
        <div class="data-item__address">${feature.properties.LDLI_Address1}</div>
        `;

      dataItem.addEventListener("click", () => {
        console.log("here");
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 15,
        });
      });
      libraryDataContainer.appendChild(dataItem);
    }

    const schoolDataContainer = document.getElementById(
      "school_data_container"
    );
    const schoolFeatures = schoolData.features;
    for (const feature of schoolFeatures) {
      let dataItem = document.createElement("div");
      dataItem.classList.add("data-item");
      dataItem.classList.add("btn");

      dataItem.innerHTML = `
        <div class="data-item__title">${feature.properties.SchoolName}</div>
        <div class="data-item__address">${feature.properties.PhysicalAddress}</div>
        `;

      dataItem.addEventListener("click", () => {
        console.log("here");
        map.flyTo({
          center: feature.geometry.coordinates,
          zoom: 15,
        });
      });
      schoolDataContainer.appendChild(dataItem);
    }

    map.on("load", () => {
      map.addSource(layers[0], {
        type: "geojson",
        data: libraryData,
      });

      map.addLayer({
        id: layers[0],
        type: "circle",
        source: layers[0],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-radius": DOT_SIZE,
          "circle-color": "#8377d1",
        },
      });

      map.addSource(layers[1], {
        type: "geojson",
        data: schoolData,
      });

      map.addLayer({
        id: layers[1],
        type: "circle",
        source: layers[1],
        layout: {
          visibility: "visible",
        },
        paint: {
          "circle-radius": DOT_SIZE,
          "circle-color": "#94bfa7",
        },
      });

      map.addSource(layers[2], {
        type: "geojson",
        data: countyData,
      });

      map.addLayer({
        id: layers[2],
        type: "fill",
        source: layers[2],
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "#2F2F2F",
          "fill-opacity": 0.1,
        },
      });
    });
  };

  const toggleLayer = (layer) => {
    const visibility = map.getLayoutProperty(layer, "visibility");

    if (visibility === "visible") {
      map.setLayoutProperty(layer, "visibility", "none");
    } else {
      map.setLayoutProperty(layer, "visibility", "visible");
    }
  };

  const toggleButtons = document.querySelectorAll('input[type="checkbox"]');

  for (const toggleButton of toggleButtons) {
    toggleButton.addEventListener("click", (event) => {
      toggleLayer(toggleButton.parentElement.id);
    });
  }

  geoJsonFetch();
});
