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
        this.element.html( this.view("//jmvcdoc/views/demo/init.ejs"));
		
		this.$htmlHeader = this.find(".html_header");
		this.$sourceHeader = this.find(".source_header");
		this.$demoHeader = this.find(".demo_header");				
		
		this.$htmlContent = this.find(".html_content");
		this.$htmlContent.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
		
		this.$sourceContent = this.find(".source_content");
		this.$sourceContent.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
		
		this.$demoContent = this.find(".demo_content");
		this.$demoContent.find("span").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
		
		this.$htmlContent.hide();
		this.$sourceContent.hide()
		this.$demoContent.show();
    },
	
	".demo_header a click" : function(el, ev) {
		this.$htmlContent.hide("slow");
		this.$htmlHeader.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");

		this.$sourceContent.hide("slow")
		this.$sourceHeader.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
				
		this.$demoContent.show("slow")
		this.$demoHeader.find("span").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");		
	},
	
	".html_header a click" : function(el, ev) {
		this.$sourceContent.hide("slow")
		this.$sourceHeader.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
				
		this.$demoContent.hide("slow")
		this.$demoHeader.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");

		this.$htmlContent.show("slow");
		this.$htmlHeader.find("span").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
	},
	
	".source_header a click" : function(el, ev) {				
		this.$demoContent.hide("slow")
		this.$demoHeader.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");

		this.$htmlContent.hide("slow");
		this.$htmlHeader.find("span").removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-e");
		
		this.$sourceContent.show("slow")
		this.$sourceHeader.find("span").removeClass("ui-icon-triangle-1-e").addClass("ui-icon-triangle-1-s");
	}		
});