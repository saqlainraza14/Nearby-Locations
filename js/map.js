var geocoder;
var map;
var markers = Array();
var infos = Array();
var datas= Array();
var sortS= Array();
var TempA=Array();
var sortN= Array();

var min=1000;
var minNam='sa';
var myJsonString='';
function initialize() {
    // prepare Geocoder
    geocoder = new google.maps.Geocoder();

    // set initial position (New York)
    var myLatlng = new google.maps.LatLng(2.998249, 101.622001);

    var myOptions = { // default map options
        zoom: 14,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(document.getElementById('gmap_canvas'), myOptions);

    var input = document.getElementById('pac-input');
    var tabs = document.getElementById('tab');
    var searchBox = new google.maps.places.SearchBox(input);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(tabs);
    /*map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(input);*/


    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function() {
      searchBox.setBounds(map.getBounds());
    });

    
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener('places_changed', function() {
      var places = searchBox.getPlaces();

      if (places.length == 0) {
        return;
      }

      // Clear out the old markers.         
      markers.forEach(function(marker) {
        marker.setMap(null);
      });
      markers = [];


      // For each place, get the icon, name and location.
      var bounds = new google.maps.LatLngBounds();
      places.forEach(function(place) {
        if (!place.geometry) {
          console.log("Returned place contains no geometry");
          return;
        }else{                  
          // store current coordinates into hidden variables
          document.getElementById('lat').value = place.geometry.location.lat();
          document.getElementById('lng').value = place.geometry.location.lng();
        }

        var icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        markers.push(new google.maps.Marker({
          map: map,
          icon: "js/marker.png",
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {              
           // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);              
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });
}

// clear overlays function
function clearOverlays() {
    if (markers) {
        for (i in markers) {
            markers[i].setMap(null);
        }
        markers = [];
        infos = [];
    }
}

// clear infos function
function clearInfos() {
    if (infos) {
        for (i in infos) {
            if (infos[i].getMap()) {
                infos[i].close();
            }
        }
    }
}

// find address function
function findAddress() {
    var address = document.getElementById("gmap_where").value;
    $('#Display').find("tr:gt(0)").remove();
    $('#CafeData').find("tr:gt(0)").remove();
    $('#RestaurantData').find("tr:gt(0)").remove();
    $('#ATMData').find("tr:gt(0)").remove();
    $('#BankData').find("tr:gt(0)").remove();
  
    // script uses our 'geocoder' in order to find location by address name
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) { // and, if everything is ok

            // we will center map
            var addrLocation = results[0].geometry.location;
            map.setCenter(addrLocation);

            // store current coordinates into hidden variables
            document.getElementById('lat').value = results[0].geometry.location.lat();
            document.getElementById('lng').value = results[0].geometry.location.lng();

            // and then - add new custom marker
            var addrMarker = new google.maps.Marker({
                position: addrLocation,
                map: map,
                title: results[0].formatted_address,
                icon: 'js/marker.png'
            });
        } else {
            alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}

// find custom places function
function findPlaces(KeyValue) {
$('#Display').find("tr:gt(0)").remove();
$('#CafeData').find("tr:gt(0)").remove();
$('#RestaurantData').find("tr:gt(0)").remove();
$('#ATMData').find("tr:gt(0)").remove();
$('#BankData').find("tr:gt(0)").remove();
    // prepare variables (filter)
    var type = KeyValue; //document.getElementById('gmap_type').value;
    //var radius = document.getElementById('gmap_radius').value;
    //var keyword = document.getElementById('gmap_keyword').value;

    var lat = document.getElementById('lat').value;
    var lng = document.getElementById('lng').value;
    var cur_location = new google.maps.LatLng(lat, lng);

    // prepare request to Places
    var request = {
        location: cur_location,
        radius: 5000, //radius,
        types: [type]
    };
   /* if (keyword) {
        request.keyword = [keyword];
    }*/


    // send request
    service = new google.maps.places.PlacesService(map);
    service.search(request, createMarkers);
  
}

// create markers (from 'findPlaces' function)
function createMarkers(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {

        // if we have found something - clear map (overlays)
        clearOverlays();

        // and create new markers by search result
        for (var i = 0; i < results.length; i++) {
            createMarker(results[i]);
        }

   //   console.log(datas+'datas');
      myJsonString = JSON.stringify(datas);
      console.log(myJsonString);
      parse($.parseJSON(myJsonString));
      //console.log(sortS);
      TempA = sortS.slice();
      //console.log(TempA);
      sortS.sort();
      //console.log(sortS);
      //console.log(sortN);
      var KeyValue = document.getElementById('data').value;
      
      
       for (var i = 0; i < sortS.length; i++) {
         
          if(KeyValue == "train_station")
          {
            $('#Display').append('<tr><td>'+sortN[TempA.indexOf(sortS[i])]+'</td><td>'+sortS[i]+'</td></tr>');             
          }
          else if(KeyValue == "cafe")
          {
            $('#CafeData').append('<tr><td>'+sortN[TempA.indexOf(sortS[i])]+'</td><td>'+sortS[i]+'</td></tr>');
          }
          else if(KeyValue == "restaurant")
          {
            $('#RestaurantData').append('<tr><td>'+sortN[TempA.indexOf(sortS[i])]+'</td><td>'+sortS[i]+'</td></tr>');
          }
          else if(KeyValue == "atm")
          {
            $('#ATMData').append('<tr><td>'+sortN[TempA.indexOf(sortS[i])]+'</td><td>'+sortS[i]+'</td></tr>');
          }
          else
          {
            $('#BankData').append('<tr><td>'+sortN[TempA.indexOf(sortS[i])]+'</td><td>'+sortS[i]+'</td></tr>');
          }

           //console.log(sortN[TempA.indexOf(sortS[i])]);
          //parseSort($.parseJSON(myJsonString),sortS[i]);
         //console.log("SAQLAIN : "+sortN[TempA.indexOf(sortS[i])]);
        }
      datas=[];
      myJsonString='';
      sortS= [];
      TempA=[];
      sortN= [];

   
    } 
    else if (status == google.maps.places.PlacesServiceStatus.ZERO_RESULTS) 
    {
      clearOverlays() 
      alert('Sorry, nothing is found');
      clearInfos();
    }
}

// creare single marker function
function createMarker(obj) {
  var icon_style;
  var KeyValue = document.getElementById('data').value;
  if(KeyValue == "train_station")
  {
    icon_style = "images/train.png";             
  }
  else if(KeyValue == "cafe")
  {
    icon_style = "images/cafe.png";
  }
  else if(KeyValue == "restaurant")
  {
    icon_style = "images/restaurant.png";
  }
  else if(KeyValue == "atm")
  {
    icon_style = "images/atm.png";
  }
  else
  {
    icon_style = "images/bank.png";
  }

    // prepare new Marker object
    var mark = new google.maps.Marker({
        position: obj.geometry.location,
        map: map,
        icon: icon_style,
        title: obj.name
    });
     // alert(obj.name);
   var lat=document.getElementById('lat').value;
   var long=document.getElementById('lng').value;
  // alert(lat);
  //alert(long);
  
  
  var p1 = new google.maps.LatLng(lat,long);
var p2 = new google.maps.LatLng(obj.geometry.location.lat(),obj.geometry.location.lng());
  
  google.maps.LatLng.prototype.distanceFrom = function(latlng) {
  var lat = [this.lat(), latlng.lat()]
  var lng = [this.lng(), latlng.lng()]
  var R = 6378137;
  var dLat = (lat[1]-lat[0]) * Math.PI / 180;
  var dLng = (lng[1]-lng[0]) * Math.PI / 180;
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
  Math.cos(lat[0] * Math.PI / 180 ) * Math.cos(lat[1] * Math.PI / 180 ) *
  Math.sin(dLng/2) * Math.sin(dLng/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  var d = R * c;
  return Math.round(d);
}
 // var loc1 = new GLatLng(lat, long);
//var loc2 = new GLatLng(obj.geometry.location.lat(), obj.geometry.location.lng());
var dist = p2.distanceFrom(p1);
//alert(dist/1000+'m');
  var distn=dist/1000;
  var dost=distn+(distn <1 ? "m" : "km")
 //$('#Display').append('<tr><td>'+obj.name+'</td><td>'+dost+'</td></tr>');
  datas.push({ place:obj.name,Distance:distn});
 //alert(google.maps.geometry.spherical.computeDistanceBetween(p1, p2)+'sa');

  
  

    markers.push(mark);

    // prepare info window
    var infowindow = new google.maps.InfoWindow({
        content: '<img src="' + obj.icon + '" /><font style="color:#000;">' + obj.name + 
        '<br />Rating: ' + obj.rating + '<br />Vicinity: ' + obj.vicinity + '</font>'
    });

    // add event handler to current marker
    google.maps.event.addListener(mark, 'click', function() {
        clearInfos();
        infowindow.open(map,mark);
    });
  
  
  
    infos.push(infowindow);
  
 // console.log(datas);

// myJsonString = JSON.stringify(datas);

//parse( $.parseJSON(myJsonString));
console.log(myJsonString);
  
}

console.log(myJsonString+'sa');
console.log(datas+'datas');
var v=0;
  function parse(obj) {
    
    // Do something.
         //alert(''); 
    $.each(obj, function(idx,obj1) {
         

        if(typeof obj1 =='object')
        {  parse(obj1);
        
        }else{
          
         //   alert(idx+":"+obj1); 
       
           if(idx==='place')
          { 
            sortN.push(obj1);
          }
          if(idx==='Distance')
          { 
            sortS.push(obj1);
          }
        }
        
    });
  }


  function  parseSort(obj,i) {
    
    // Do something.
         //alert(''); 
    $.each(obj, function(idx,obj1) {
         

        if(typeof obj1 =='object')
        {  parseSort(obj,i);
        
        }else{
          
            alert(idx+":"+obj1); 
          var previous='';
          if(idx==='place')
          { 
            
            //sortS.push(obj1);
           previous=obj1;
            
          }
          if(idx==='Distance')
          { 
            
            //sortS.push(obj1);
             if(i===obj1)
          { 
            
            //sortS.push(obj1);
            alert("here");
          //  $('#Display').append('<tr><td>'+obj1+'</td><td>'+previous+'</td></tr>');
            
          }
            
          }
        }
        
    });
  }

//parse(datas);

function SortF(){
  
      var table = $('#Display');
    
    $('#facility_header, #city_header')
        .wrapInner('<span title="sort this column"/>')
        .each(function(){
            
            var th = $(this),
                thIndex = th.index(),
                inverse = false;
            
            th.click(function(){
                
                table.find('td').filter(function(){
                    
                    return $(this).index() === thIndex;
                    
                }).sortElements(function(a, b){
                    
                    return $.text([a]) > $.text([b]) ?
                        inverse ? -1 : 1
                        : inverse ? 1 : -1;
                    
                }, function(){
                    
                    // parentNode is the element we want to move
                    return this.parentNode; 
                    
                });
                
                inverse = !inverse;
                    
            });
                
        });

  
}
 

// initialization
google.maps.event.addDomListener(window, 'load', initialize);