window.addEventListener("load", () => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/april429/clblex4r9001k14mae7y5oron", // style URL
    zoom: 6.5, // starting zoom
    center: [-120.7, 47.5], // starting center
  });

  const layers = ["library_data", "school_data", "county_data"];
  const DOT_SIZE = 5;

  const geoJsonFetch = async () => {
    const libraryResponse = await fetch(
      "https://ehubbartt.github.io/Washington-Library-and-School-Distances/assets/data/Cleaned_Washington_Library_Locations.geojson"
    );
    const libraryData = await libraryResponse.json();

    const schoolResponse = await fetch(
      "https://ehubbartt.github.io/Washington-Library-and-School-Distances/assets/data/Cleaned_Washington_State_Public_Schools.geojson"
    );
    const schoolData = await schoolResponse.json();

    const countyResponse = await fetch(
      "https://ehubbartt.github.io/Washington-Library-and-School-Distances/assets/data/Washington_Counties_(no_water).geojson"
    );
    const countyData = await countyResponse.json();

    const updateDataList = (features, type) => {
      const id =
        type === "library" ? "library_data_container" : "school_data_container";
      const schoolDataContainer = document.getElementById(id);

      //remove previous children of the data container
      while (schoolDataContainer.firstChild) {
        schoolDataContainer.removeChild(schoolDataContainer.firstChild);
      }

      const numResults = document.createElement("span");
      numResults.innerHTML = `${features.length} results`;
      schoolDataContainer.appendChild(numResults);

      for (const feature of features) {
        let dataItem = document.createElement("div");
        dataItem.classList.add("data-item");
        dataItem.classList.add("btn");

        let dataTitle = "";
        let dataAddress = "";

        if (type === "library") {
          dataTitle = feature.properties.Library;
          dataAddress = feature.properties.LDLI_Address1;
        } else {
          dataTitle = feature.properties.SchoolName;
          dataAddress = feature.properties.PhysicalAddress;
        }

        const distance = feature.properties.distance?.toFixed(2);

        if (distance) {
          dataItem.innerHTML = `
          <div class="data-item__title">${dataTitle}</div>
          <div class="data-item__address">${dataAddress}</div>
          <div class="data-item__distance">${distance} miles</div>
          `;
        } else {
          dataItem.innerHTML = `
        <div class="data-item__title">${dataTitle}</div>
        <div class="data-item__address">${dataAddress}</div>
        `;
        }

        dataItem.addEventListener("click", () => {
          selectNewFeature(feature);
          map.flyTo({
            center: feature.geometry.coordinates,
            zoom: 10,
          });
        });
        schoolDataContainer.appendChild(dataItem);
      }
    };

    const deselectFeature = () => {
      const selectedFeatureContainer = document.querySelector(
        ".selected-feature-container"
      );
      selectedFeatureContainer.innerHTML = `<H3 class="selected-feature-title">Please Select a point on the map or from below for distance comparison</H3>`;
      updateDataList(libraryData.features, "library");
      updateDataList(schoolData.features, "school");
      //remove all circles from turf
      if (map.getSource("circle")) {
        map.removeLayer("circle");
        map.removeSource("circle");
      }
      map.flyTo({
        center: [-120.7, 47.5],
        zoom: 6.5,
      });
    };

    const selectNewFeature = (feature) => {
      const featureType = feature.properties.Library ? "library" : "school";
      const selectedFeatureContainer = document.querySelector(
        ".selected-feature-container"
      );
      const featureItem = document.createElement("div");
      featureItem.classList.add("feature-item");
      featureItem.classList.add("btn");

      const searchbar = document.querySelector(".search-bar");
      console.log(searchbar);
      searchbar.value = "";

      featureItem.addEventListener("click", () => {
        deselectFeature();
      });

      const selectedFeatureTitle = document.querySelector(
        ".selected-feature-title"
      );
      selectedFeatureTitle.innerHTML = "Selected Feature";

      if (featureType === "library") {
        featureItem.innerHTML = `
        <div class="feature-item__title">${feature.properties.Library}</div>
        <div class="feature-item__address">${feature.properties.LDLI_Address1}</div>
        `;
      } else {
        featureItem.innerHTML = `
        <div class="feature-item__title">${feature.properties.SchoolName}</div>
        <div class="feature-item__address">${feature.properties.PhysicalAddress}</div>
        `;
      }

      //remove previous source and layer
      if (map.getSource("circle")) {
        map.removeLayer("circle");
        map.removeSource("circle");
      }

      //use turf to create a 50 mile circle
      var options = {
        steps: 100,
        units: "miles",
      };
      let circle = turf.circle(feature.geometry.coordinates, 5, options);
      //find how many features are within the turf circle
      let libraryCount = turf.within(libraryData, circle);
      let schoolCount = turf.within(schoolData, circle);

      //find out how far away each feature is from the selected feature
      for (const library of libraryCount.features) {
        library.properties.distance = turf.distance(
          feature.geometry.coordinates,
          library.geometry.coordinates,
          options
        );
      }

      for (const school of schoolCount.features) {
        school.properties.distance = turf.distance(
          feature.geometry.coordinates,
          school.geometry.coordinates,
          options
        );
      }

      libraryCount.features.sort(
        (a, b) => a.properties.distance - b.properties.distance
      );

      schoolCount.features.sort(
        (a, b) => a.properties.distance - b.properties.distance
      );

      const searchBar = document.querySelector(".search-bar");
      searchBar.addEventListener("keyup", (e) => {
        const searchValue = e.target.value;
        const tempLibraryData = libraryCount.features.filter((feature) => {
          const library = feature.properties.Library.toLowerCase();
          return library.includes(searchValue.toLowerCase());
        });
        const tempSchoolData = schoolCount.features.filter((feature) => {
          const school = feature.properties.SchoolName.toLowerCase();
          return school.includes(searchValue.toLowerCase());
        });
        if (
          document.querySelector(".selected-feature-title").innerHTML ===
          "Selected Feature"
        ) {
          updateDataList(tempSchoolData, "school");
          updateDataList(tempLibraryData, "library");
        }
      });

      updateDataList(libraryCount.features, "library");
      updateDataList(schoolCount.features, "school");

      //add the circle to the map
      map.addSource("circle", {
        type: "geojson",
        data: circle,
      });

      map.addLayer({
        id: "circle",
        type: "fill",
        source: "circle",
        layout: {
          visibility: "visible",
        },
        paint: {
          "fill-color": "#2F2F2F",
          "fill-opacity": 0.1,
        },
      });

      const selectedFeatureItems = document.querySelectorAll(".feature-item");
      for (const selectedFeatureItem of selectedFeatureItems) {
        selectedFeatureItem.remove();
      }
      selectedFeatureContainer.appendChild(featureItem);
    };

    const searchBar = document.querySelector(".search-bar");
    searchBar.addEventListener("keyup", (e) => {
      const searchValue = e.target.value;
      const tempLibraryData = libraryData.features.filter((feature) => {
        const library = feature.properties.Library.toLowerCase();
        return library.includes(searchValue.toLowerCase());
      });
      const tempSchoolData = schoolData.features.filter((feature) => {
        const school = feature.properties.SchoolName.toLowerCase();
        return school.includes(searchValue.toLowerCase());
      });
      if (
        document.querySelector(".selected-feature-title").innerHTML !==
        "Selected Feature"
      ) {
        updateDataList(tempSchoolData, "school");
        updateDataList(tempLibraryData, "library");
      }
    });

    updateDataList(libraryData.features, "library");
    updateDataList(schoolData.features, "school");

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
          "circle-color": "#445E93",
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
          "circle-color": "#8377d1",
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

    map.on("click", layers[0], (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.Library;

      selectNewFeature(e.features[0]);

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
    });

    map.on("click", layers[1], (e) => {
      const coordinates = e.features[0].geometry.coordinates.slice();
      const description = e.features[0].properties.SchoolName;

      selectNewFeature(e.features[0]);

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }
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

  const selectors = document.querySelectorAll(".selector");
  for (const selector of selectors) {
    selector.addEventListener("click", (e) => {
      if (selector.classList.contains("active")) return;
      selectors[0].classList.toggle("active");
      selectors[1].classList.toggle("active");

      const libraryDataContainer = document.getElementById(
        "library_data_container"
      );
      const schoolDataContainer = document.getElementById(
        "school_data_container"
      );

      libraryDataContainer.classList.toggle("hidden");
      schoolDataContainer.classList.toggle("hidden");
    });
  }

  geoJsonFetch();
});
