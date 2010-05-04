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
        hljs.start();
		
		var demoSrc = this.element.attr("data-demo-src");
        this.element.html( this.view("//jmvcdoc/views/demo/init.ejs", {demoSrc: demoSrc}));
		var $iframe = this.find("iframe");
        this.find(".demo_content").css({"padding":"5px"});

        var self = this;		
		var height = 320, html = "", source = "";
		$iframe.bind("load", function(){
			var $body = $( this.contentWindow.document.body );
			html = $body.find("#demo-html").html();
			self.find(".html_content")
			  .html( "<pre><code class=\"html\"></code></pre>" )
			  .find("code").text( html ).highlight();
			  
			source = $body.find("#demo-source").text();
			self.find(".source_content")
			  .html( "<pre><code class=\"javascript\"></code></pre>" )
              .find("code").text( source ).highlight();

			height = $body.outerHeight();
			$iframe.height( height + 50 );
			self.find(".demo_content").height( height + 50 );
		})
    },
		
	".section click" : function(el, ev) {
		el.next().toggle("slow")
		el.find("span").toggleClass("ui-icon-triangle-1-s").toggleClass("ui-icon-triangle-1-e");
	}});