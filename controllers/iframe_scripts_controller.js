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
     }	 
});