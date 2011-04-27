steal.loadedProductionCSS = true;
steal
 .plugins(
	'jquery/controller',
	'jquery/view/ejs',
	'jquery/event/hashchange',
	'jquery/controller/view',
	'jquery/lang/json', 
	'jquery/lang/deparam',
	'jquery/dom/cookie',
	'mxui/layout/positionable'//, 
	//'mxui/nav/menuable'
	)
 .resources( 
	'helpers', 
	'highlight', 
	'languages/javascript', 
	'languages/www')
 .models(
	'favorites',
	'search')
 .controllers(
	"documentation",
	"iframe",
	"demo")
 .views(
	'//jmvcdoc/views/attribute.ejs',
	'//jmvcdoc/views/class.ejs',
	'//jmvcdoc/views/constructor.ejs',
	'//jmvcdoc/views/favorite.ejs',
	'//jmvcdoc/views/function.ejs',
	'//jmvcdoc/views/page.ejs', 
	'//jmvcdoc/views/results.ejs', 
	'//jmvcdoc/views/top.ejs', 
	'//jmvcdoc/views/iframe/init.ejs', 
	'//jmvcdoc/views/iframe/menu.ejs', 
	'//jmvcdoc/views/demo/init.ejs')
 .then(function() {
	var pageNameArr = window.location.href.match(/docs\/(.*)\.html/),
		pageName = pageNameArr && pageNameArr[1];
		
		if ( pageName && location.hash == "" ) {
			window.location.hash = "&who=" + pageName
		}
	$(document).documentation();
	
  })

if ( typeof(COMMENTS_LOCATION) != "undefined" ) {
	steal.css("http://mediacdn.disqus.com/1066/build/themes/narcissus.css?1281560657&", 
	          "http://mediacdn.disqus.com/1066/styles/embed/thread.css?");
			  
	if ( window.location.protocol == "file:" || window.location.hostname == "localhost" ) { // development
		window.disqus_developer = 1
	}
}