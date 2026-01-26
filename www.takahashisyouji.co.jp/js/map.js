var map;
var marker;
var honsha = {
  lat: 35.596142, // 緯度
  lng: 138.575336 // 経度
};
var kofu = {
  lat: 35.581466, // 緯度
  lng: 138.593939 // 経度
};
var hatta = {
  lat: 35.661962, // 緯度
  lng: 138.459712 // 経度
};
var shirane = {
  lat: 35.641590, // 緯度
  lng: 138.473439 // 経度
};
var fujikawa = {
  lat: 35.569667, // 緯度
  lng: 138.454028 // 経度
};
var yousetsu = {
  lat: 35.595901, // 緯度
  lng: 138.571815 // 経度
};
function initMap() {
 map = new google.maps.Map(document.getElementById('map'), { // 地図を埋め込む
     center: honsha, // 地図の中心を指定
     zoom: 12 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: honsha, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });


 map = new google.maps.Map(document.getElementById('map_honsha'), { // 地図を埋め込む
     center: honsha, // 地図の中心を指定
     zoom: 15 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: honsha, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });

// *******************************************************************************

 map = new google.maps.Map(document.getElementById('map_kofu'), { // 地図を埋め込む
     center: kofu, // 地図の中心を指定
     zoom: 15 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: kofu, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });

// *******************************************************************************

 map = new google.maps.Map(document.getElementById('map_hatta'), { // 地図を埋め込む
     center: hatta, // 地図の中心を指定
     zoom: 15 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: hatta, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });

// *******************************************************************************

 map = new google.maps.Map(document.getElementById('map_shirane'), { // 地図を埋め込む
     center: shirane, // 地図の中心を指定
     zoom: 15 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: shirane, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });

// *******************************************************************************

 map = new google.maps.Map(document.getElementById('map_fujikawa'), { // 地図を埋め込む
     center: fujikawa, // 地図の中心を指定
     zoom: 15 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: fujikawa, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });

// *******************************************************************************

 map = new google.maps.Map(document.getElementById('map_yousetsu'), { // 地図を埋め込む
     center: yousetsu, // 地図の中心を指定
     zoom: 15 // 地図のズームを指定
   });
 
 marker = new google.maps.Marker({ // マーカーの追加
        position: yousetsu, // マーカーを立てる位置を指定
      map: map // マーカーを立てる地図を指定
   });

}
