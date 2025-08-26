let map;
let colors = [
    "#3cb44b","#e6194b","#ffe119","#4363d8","#f58231","#911eb4",
    "#46f0f0","#f032e6","#bcf60c","#fabebe","#008080","#e6beff",
    "#9a6324","#fffac8","#800000","#aaffc3","#808000","#ffd8b1",
    "#000075",
];

function initMap() {
    // const jakarta = { lat: 0.5, lng: 110 };
    const jakarta = { lat: -5.595, lng: 129.181 };

    // Inisialisasi peta
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: jakarta,
        gestureHandling: 'greedy', // Mengizinkan zoom menggunakan scroll
        mapTypeId: google.maps.MapTypeId.HYBRID,
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_LEFT // Pindahkan ke bawah kiri
        },
        styles: [
            {
                featureType: "administrative.locality", // Nama kota
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "administrative.neighborhood", // Nama kelurahan
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "poi", // Tempat umum
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "road",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [{ visibility: "off" }]
            },
            {
                featureType: "administrative.province", // Nama provinsi
                elementType: "labels",
                stylers: [{ visibility: "on" }]
            }
        ]
    });

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ location: jakarta }, (results, status) => {
        if (status === "OK" && results[0]) {
            let province = '';
            for (const component of results[0].address_components) {
                if (component.types.includes("administrative_area_level_1")) {
                    province = component.long_name;
                    break;
                }
            }

            const infowindow = new google.maps.InfoWindow({
                content: `<strong>${province}</strong>`,
            });
            infowindow.open(map);
        }
    });

    const wsAmbonSeram = '/data/WS_AMBON-SERAM.json';
    const wsYamdena = '/data/WS_KEPULAUAN_YAMDENA-WETAR.json';
    const dasAmbonSeram = '/data/DAS AMBON-SERAM.json';
    const dasYamdena = '/data/DAS KEPULAUAN YAMDENA-WETAR.json';
    const sungaiMaluku = "/data/Sungai_WS_AMBON-SERAM.json";
    const sungaiYamdena = "/data/Sungai_WS_KEPULAUAN_YAMDENA-WETAR.json";

    loadWsJson(wsAmbonSeram, '#e6194b');
    loadWsJson(wsYamdena, '#ffe119');
    loadDasJson(dasAmbonSeram, '#911eb4');
    loadDasJson(dasYamdena, '#46f0f0');
    // loadRiverJson(sungaiYamdena);
    // loadRiverJson(sungaiMaluku);
}

function loadWsJson(url, color) {
    fetch(url)
        .then(res => res.json())
        .then(topoData => {
            const objectName = Object.keys(topoData.objects)[0];
            const geojson = topojson.feature(topoData, topoData.objects[objectName]);

            // Buat Data Layer baru
            const dataLayer = new google.maps.Data({ map: map });

            // Tambahkan GeoJSON ke layer ini
            dataLayer.addGeoJson(geojson);

            // Styling khusus untuk layer ini
            dataLayer.setStyle({
                fillColor: color,
                fillOpacity: 0.4,
                strokeColor: "black",
                strokeWeight: 1,
                zIndex: 1
            });
        })
        .catch(err => console.error("Error load topojson:", err));
}

function loadDasJson(url, color) {
    fetch(url)
        .then(res => res.json())
        .then(topoData => {
            const objectName = Object.keys(topoData.objects)[0];
            const geojson = topojson.feature(topoData, topoData.objects[objectName]);

            // Buat Data Layer baru
            const dataLayer = new google.maps.Data({ map: map });

            // Tambahkan GeoJSON ke layer ini
            dataLayer.addGeoJson(geojson);

            // Styling khusus untuk layer ini
            dataLayer.setStyle({
                fillColor: color,
                fillOpacity: 0.4,
                strokeColor: "black",
                strokeWeight: 1,
                zindex: 2
            });
        })
        .catch(err => console.error("Error load topojson:", err));
}

function loadRiverJson(url, color = "#0000ff") {
    fetch(url)
        .then(res => res.json())
        .then(topoData => {
            const objectName = Object.keys(topoData.objects)[0];
            const geojson = topojson.feature(topoData, topoData.objects[objectName]);

            // Buat Data Layer baru untuk sungai
            const riverLayer = new google.maps.Data({ map: map });

            // Tambahkan GeoJSON ke layer sungai
            riverLayer.addGeoJson(geojson);

            // Styling garis sungai
            riverLayer.setStyle({
                strokeColor: color,
                strokeOpacity: 0.4,
                strokeWeight: 1,
                fillOpacity: 0, // sungai biasanya bukan polygon
                zIndex: 3
            });
        })
        .catch(err => console.error("Error load river topojson:", err));
}

$(document).ready(function() {
    $("#table-ews").DataTable({ 
        responsive: false,
        language: { 
            paginate: { 
                previous: "<i class='mdi mdi-chevron-left'>", 
                next: "<i class='mdi mdi-chevron-right'>" 
            } 
        }, 
        drawCallback: function () { 
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded") 
        }
    });

    $("#table-rainfall").DataTable({ 
        responsive: false,
        language: { 
            paginate: { 
                previous: "<i class='mdi mdi-chevron-left'>", 
                next: "<i class='mdi mdi-chevron-right'>" 
            } 
        }, 
        drawCallback: function () { 
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded") 
        }
    });

    $("#table-tma").DataTable({ 
        responsive: false,
        language: { 
            paginate: { 
                previous: "<i class='mdi mdi-chevron-left'>", 
                next: "<i class='mdi mdi-chevron-right'>" 
            } 
        }, 
        drawCallback: function () { 
            $(".dataTables_paginate > .pagination").addClass("pagination-rounded") 
        }
    });
});