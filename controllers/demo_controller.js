/**
 * @tag home
 * 
 * Handles @demo logic
 */
jQuery.Controller.extend('DemoController',
/* @Static */
{ 
},
/* @Prototype */
{
    init : function() {
		var demoSrc = this.element.attr("data-demo-src");
        this.element.html( this.view("//jmvcdoc/views/demo/init.ejs", {demoSrc: demoSrc}));
		var $iframe = this.find("iframe");
        this.find(".demo_content").css({"padding":"5px"});

        var self = this;		
		var height = 320, html = "", source = "";
		$iframe.bind("load", function(){
			var $body = $( this.contentWindow.document.body );
			height = $body.css("outerHeight");
			html = $body.find("#demo-html").html();
			self.find(".html_content").text( html );
			source = $body.find("#demo-source").html();
			self.find(".source_content").text( source );
			$( this ).height( height );
			self.find(".demo_content").height( height + 10 );
			self.element.trigger("resize")
		})
    },
		
	".section click" : function(el, ev) {
		el.next().toggle("slow")
		el.find("span").toggleClass("ui-icon-triangle-1-s").toggleClass("ui-icon-triangle-1-e");
	}});