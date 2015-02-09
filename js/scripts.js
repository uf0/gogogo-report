d3.select('#section1').attr("style", 'margin-top:' + $('#header').height() + 'px')

d3.select('#nav').attr("style", 'top:' + $('#header').height() + 'px')

$('.carousel').carousel({interval:false});

$('#nav').on('affixed.bs.affix', function () {
    d3.select('#nav').attr("style", null)
    console.log("ciao")
});

$('#nav').on('affix.bs.affix', function () {
    d3.select('#nav').attr("style", null)
    console.log("ciao pre")
});

/* affix the navbar after scroll below header */
$('#nav').affix({
      offset: {
        top: $('#header').height()
      }
});	

/* highlight the top nav as scrolling occurs */
$('body').scrollspy({ target: '#nav', offset: 100 })

/* smooth scrolling for scroll to top */
$('.scroll-top').click(function(){
  $('body,html').animate({scrollTop:0},1000);
})

/* smooth scrolling for nav sections */
$('#nav .navbar-nav li>a').click(function(e){
    e.preventDefault();
  var link = $(this).attr('href');
  var posi = $(link).offset().top;
  $('body,html').animate({scrollTop:posi+"px"},700);
});


// /* copy loaded thumbnails into carousel */
// $('.panel .img-responsive').on('load', function() {
  
// }).each(function(i) {
//   if(this.complete) {
//   	var item = $('<div class="item"></div>');
//     var itemDiv = $(this).parent('a');
//     var title = $(this).parent('a').attr("title");
    
//     item.attr("title",title);
//   	$(itemDiv.html()).appendTo(item);
//   	item.appendTo('#modalCarousel .carousel-inner'); 
//     if (i==0){ // set first item active
//      item.addClass('active');
//     }
//   }
// });

// /* activate the carousel */
// $('#modalCarousel').carousel({interval:false});

// /* change modal title when slide changes */
// $('#modalCarousel').on('slid.bs.carousel', function () {
//   $('.modal-title').html($(this).find('.active').attr("title"));
// })

// /* when clicking a thumbnail */
// $('.panel-thumbnail>a').click(function(e){
  
//     e.preventDefault();
//     var idx = $(this).parents('.panel').parent().index();
//   	var id = parseInt(idx);
  	
//   	$('#myModal').modal('show'); // show the modal
//     $('#modalCarousel').carousel(id); // slide carousel to selected
//   	return false;
// });


/* map interactive */

var mapsDistrict = [
  $('#district_01 .district_map'),
  $('#district_02 .district_map'),
  $('#district_03 .district_map'),
  $('#district_04 .district_map')
  ]

mapsDistrict.forEach(function(d,i){

  d.height(d.width());

  window['map_' + i] = L.map(
      d[0]//,
      //{maxBounds: [[52.2829,4.7948],[52.4476,5.0187]]}
      ).setView([52.3667, 4.9000], 11);

    var stamenLayer = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png', {
      // attribution: '<a href="http://stamen.com">Stamen Design</a> | <a href="http://openstreetmap.org">OpenStreetMap</a>',
      attributionControl: false,
      infoControl: true,
      minZoom:8,
      maxZoom:17
  }).addTo(window['map_' + i]);

window['map_' + i].on('moveend', follow).on('zoomend', follow);
window['map_' + i].scrollWheelZoom.disable();

d3.json('data/pind_' + i +'.json', function(error, data){
  L.geoJson(data, { style: L.mapbox.simplestyle.style }).addTo(window['map_' + i]);
})

})

// when either map finishes moving, trigger an update on the other one.


// quiet is a cheap and dirty way of avoiding a problem in which one map
// syncing to another leads to the other map syncing to it, and so on
// ad infinitum. this says that while we are calling sync, do not try to 
// loop again and sync other maps
var quiet = false;
function follow(e) {
    if (quiet) return;
    quiet = true;
    if (e.target === window['map_0']){
     sync(window['map_1'], e)
     sync(window['map_2'], e)
     sync(window['map_3'], e)
    };
    if (e.target === window['map_1']) {
      sync(window['map_0'], e)
     sync(window['map_2'], e)
     sync(window['map_3'], e)
    };
    if (e.target === window['map_2']) {
      sync(window['map_0'], e)
     sync(window['map_1'], e)
     sync(window['map_3'], e)
    };
    if (e.target === window['map_3']) {
      sync(window['map_0'], e)
     sync(window['map_1'], e)
     sync(window['map_2'], e)
    };
    quiet = false;
}

// sync simply steals the settings from the moved map (e.target)
// and applies them to the other map.
function sync(map, e) {
    map.setView(e.target.getCenter(), e.target.getZoom(), {
        animate: false,
        reset: true
    });
}

/* statistics */

d3.json('data/statsperday.json', function(error, data){
  data.forEach(function(d,i){
    var div = d3.select('#stats_' + i);
    div.append("h5").text("teams")
    div.append("p").text(d.values.totTeams)
    div.append("h5").text("routes")
    div.append("p").text(d.values.totRoutes)
    div.append("h5").text("distance")
    div.append("p").html(d3.format(".2f")(d.values.totKm) + '<span class="km">km</span>')
  })
})

/* video autoplay/pause on scroll */

var froogaloop = $f(playerVimeo)

function elementInViewport(el) {

  var el = el[0]

  var top = el.offsetTop;
  var left = el.offsetLeft;
  var width = el.offsetWidth;
  var height = el.offsetHeight;

  while(el.offsetParent) {
    el = el.offsetParent;
    top += el.offsetTop;
    left += el.offsetLeft;
  }

  return (
    top < (window.pageYOffset + window.innerHeight) &&
    left < (window.pageXOffset + window.innerWidth) &&
    (top + height) > window.pageYOffset &&
    (left + width) > window.pageXOffset
    );
}

function callbackIn () {
  setTimeout(
    function(){
      froogaloop.api('play')
    }, 500)
} 

function callbackOut () {
  froogaloop.api('pause');
} 

function fireIfElementVisible (el, callbackIn, callbackOut) {
  return function () {
    if ( elementInViewport(el) ) {
      callbackIn();
    }else{
      callbackOut()
    }
  }
}

var videoHandler = fireIfElementVisible($(".video-responsive"), callbackIn, callbackOut);

$(window).on('resize scroll', videoHandler); 