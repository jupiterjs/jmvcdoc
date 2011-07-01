steal.plugins('jquery/controller',
	'jquery/lang/observe/delegate',
	'jquery/view/ejs',
	'jmvcdoc/highlight')
	.then(
		'//jmvcdoc/resources/helpers',
		'//jmvcdoc/models/search',
		'../style.css',
		'doc_updated',

	'views/attribute.ejs',
	'views/class.ejs',
	'views/constructor.ejs',
	'views/favorite.ejs',
	'views/function.ejs',
	'views/page.ejs', 
	'views/results.ejs', 
	'views/top.ejs', 
		function($){

/**
 * @class Jmvcdoc.Content
 */
$.Controller('Jmvcdoc.Content',
/* @Static */
{
	defaults : {
	
	}
},
/* @Prototype */
{
	init : function(){
		
	},
	"{clientState} who change" : function(clientState, ev, attr, how, val){
		// write out who this is
		if( how === "remove" ) {
			// we should search for 'home'
			return;
		}
		this.element.html("Loading ...")
			.scrollTop(0);
		Doc.findOne({
			name: val
		}, this.callback('show'));
		
	},
	show : function(docData){
		this.element.html("//jmvcdoc/content/views/" + docData.type.toLowerCase() + ".ejs", docData, DocumentationHelpers)
			.trigger("docUpdated",[docData]);
	}
})

});