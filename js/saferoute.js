 $(document).ready(function(){
          $("#button_id").click(function() {
            setupMapFrame();
            initMap();
          });
      });

      function setupMapFrame() {
        str = $('.hide').html();
        str = str.replace('#',$("#start_location_id").val().replace(" ","+"));
        str = str.replace('@',$("#end_location_id").val().replace(" ","+"));
        $('#mapFrame').html(str);
      }

      function initMap() {
        var markerArray = [];

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;

        // Create a map and center it on Manhattan.
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 40.771, lng: -73.974}
        });

        // Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;

        // Display the route between the initial start and end selections.
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
        // Listen to change events from the start and end lists.
        var onChangeHandler = function() {
          calculateAndDisplayRoute(
              directionsDisplay, directionsService, markerArray, stepDisplay, map);
        };
      }

      function calculateAndDisplayRoute(directionsDisplay, directionsService,
          markerArray, stepDisplay, map) {
        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        directionsService.route({
          origin: $("#start_location_id").val(),
          destination: $("#end_location_id").val(),
          travelMode: 'WALKING'
        }, function(response, status) {
          // Route the directions and pass the response to a function to create
          // markers for each step.
          if (status === 'OK') {
            //document.getElementById('warnings-panel').innerHTML = '<b>' + response.routes[0].warnings + '</b>';
            directionsDisplay.setDirections(response);
            showSteps(response, markerArray, stepDisplay, map);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }

      function showSteps(directionResult, markerArray, stepDisplay, map) {
        // For each step, place a marker, and add the text to the marker's infowindow.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var steps = directionResult.routes[0].legs[0].steps;
        cleanAddressList = [];
        for (var i = steps.length - 1; i >= 0; i--) {
          raw_step = steps[i]
          prep_step = raw_step.instructions.replace(/<\/?[^>]+(>|$)/g, " ").replace("&nbsp;"," ");
          cleanAddress = getAddress(prep_step);
          if(cleanAddress === "" || cleanAddressList.includes(cleanAddress))
          {
            // Discard
          }
          else
          {
            cleanAddressList.push(cleanAddress)
          }
        }
        console.log(cleanAddressList);
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
          var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
          marker.setMap(map);
          marker.setPosition(myRoute.steps[i].start_location);
          attachInstructionText(
              stepDisplay, marker, myRoute.steps[i].instructions, map);
        }
      }

      function getAddress(dirtyAddress) {
        dirtyAddressWordList = dirtyAddress.split(" ");
        addressList = [];
        for (var i = dirtyAddressWordList.length - 1; i >= 0; i--) {
          addWord = dirtyAddressWordList[i];

          if(i==0 || addWord === addWord.toLowerCase()|| addWord === "Destination")
          {
            //Discard
          }
          else
          {
            addressList.unshift(addWord);
          }
        }
        return addressList.join(" ");
      }

      function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function() {
          // Open an info window when the marker is clicked on, containing the text
          // of the step.
          stepDisplay.setContent(text);
          stepDisplay.open(map, marker);
        });
      }