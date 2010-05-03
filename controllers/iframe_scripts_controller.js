/**
 * @tag home
 * 
 * Handles iframe scripts menu evets
 */
jQuery.Controller.extend('IframeScriptsController',
/* @Static */
{ 
},
/* @Prototype */
{
     ".iframe_menu_item a click": function(el, ev){
         var src = el.attr("data-src")
         window.open(src, src);
     },
	 
     windowresize:function(el, ev) {
         $(".iframe_menu_wrapper").trigger('move', $(".iframe_menu_button"));
     },
	 
	 ".iframe_menu_item a mouseenter": function(el, ev){
	 	el.css("background-color","blue");
		el.css("color","white");
	 },
	 
	 ".iframe_menu_item a mouseleave": function(el, ev){
	 	el.css("background-color","");
		el.css("color","");	 	
	 }	 
});