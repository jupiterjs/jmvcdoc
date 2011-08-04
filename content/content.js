steal('jquery/controller',
	'jquery/lang/observe/delegate',
	'jquery/view/ejs',
	'jmvcdoc/highlight',
	
	'jmvcdoc/resources/helpers.js',
	'jmvcdoc/models/search.js',
	'../style.css',
	'./doc_updated.js').then(

	'./views/attribute.ejs',
	'./views/class.ejs',
	'./views/constructor.ejs',
	'./views/favorite.ejs',
	'./views/function.ejs',
	'./views/page.ejs', 
	'./views/results.ejs', 
	'./views/top.ejs', 
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
		this._currentPage = val;
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
		$('#results a.open').removeClass('open')
		$('#results a[href="#&who='+this._currentPage+'"]').addClass('open');
	}
})

});