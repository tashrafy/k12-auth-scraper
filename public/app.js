let map;

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

function initMap() {
  let latlng = new google.maps.LatLng(37.09024, -95.712891);
  let myOptions = {
      zoom: 5,
      center: latlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  }; 
  map = new google.maps.Map(document.getElementById("map"), myOptions);


  readTextFile("./school_districts_eval.json", function(text){
    var data = JSON.parse(text);
    console.log(data.length)
    console.log(data.filter(el => el['Login Type'] === null).length)
    console.log(data.filter(el => el['Login Type'] === 'sso').length)
    console.log(data.filter(el => el['Login Type'] === 'basic').length)
    for (let key in data) {
      const addr = data[key];
      const schoolLat = parseFloat(addr['Address : Latitude']);
      const schoolLng = parseFloat(addr['Address : Longitude']);
      const isNullAuth = addr['Login Type'] === null;
      
      if (!isNullAuth) {
        new google.maps.Marker({
          position: new google.maps.LatLng(schoolLat, schoolLng + parseFloat(key * .001)),
          map,
          title: `${addr['School District Name']} - ${addr['Login Link']}`,
          icon: {
            url: `http://maps.google.com/mapfiles/ms/icons/${addr['Login Type'] === 'sso' ? 'green' : 'red'}-dot.png`
          }
        });
      }
    }
  });
}