let map;
function initMap() {
    // const jakarta = { lat: 0.5, lng: 110 };
    const jakarta = { lat: -3.695, lng: 128.181 };

    // Inisialisasi peta
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
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