/* global google */
(function () {
    'use strict';

    const tagInput = $('#tag');
    const places = $('#places');
    const sidebar = $('#sidebar');
    const hideButton = $('#hide');

    $('#go').click(() => {
        loadGeonames();

    });

    async function loadGeonames() {
        try {
            const r = await fetch(`http://api.geonames.org/wikipediaSearch?q=${tagInput.val()}&maxRows=10&username=rivifriedman&type=json`);
            if (!r.ok) {
                throw new Error(`${r.status} ${r.statusText}`);
            }
            const results = await r.json();
            places.empty();
            results.geonames.forEach(place => {
                const theLi = $(`<li>
                <span>${place.title}</span>
                </li>`)
                    .appendTo(places)
                    .click(() => {
                        let latitude = place.lat;
                        let longitude = place.lng;
                        map.panTo({ lat: latitude, lng: longitude });
                        createMarker(place);
                    });
            });
            sidebar.show();
        }
        catch (e) {
            console.error(e);
        }
    }

    hideButton.click(() => {
        sidebar.hide();
    });

    const map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng({ lat: 40.612390, lng: -73.960210 }),
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.SATELLITE
    });

    function createMarker(place) {
        const marker = new google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map: map,
            animation: google.maps.Animation.DROP,
            title: place.title,
            icon: {
                url: place.thumbnailImg,
                scaledSize: new google.maps.Size(50, 50)
            }
        });
        marker.addListener('click', () => {
            const infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(`${place.summary}<br>
            <a target ="_blank" href ="http://${place.wikipediaUrl}">more info</a>`);
            infoWindow.open(map, marker);
        });
    }




}());