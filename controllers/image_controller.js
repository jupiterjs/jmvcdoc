/**
 * @tag home
 * 
 * Adds an image.
 */
jQuery.Controller.extend('ImageController',
/* @Static */
{ 
},
/* @Prototype */
{
     init : function(){
         var self = this;
         var height = 320, html = "", source = "";
		 var scripts = [];
       
         this.element.html( this.view("//jmvcdoc/views/image/init.ejs"));

         var src = steal.root.join(this.element.attr("data-image-src"));
         height = !this.element.attr("data-image-height") ? height : this.element.attr("data-image-height");
         var $image = this.find("img");
		 $image.attr("src", src);
		 $image.attr("height", height);			
	 }    
	 
});