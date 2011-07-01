steal.plugins('jquery/class').then('favorites',function(){
	var data;
	
	$.ajaxSetup({
		converters: {
			"json addFavorites": function(data){
				data.isFavorite = Favorites.isFavorite(data)
				return data;
			}
		}
	});
	
	$.Class("Doc",{
		location : null,
		load: function( success ) {
			// see if we have latest in localStorage
			
			if(window.localStorage && window.JMVCDOC_TIMESTAMP){
				var json = window.localStorage["jmvcDoc"+JMVCDOC_TIMESTAMP]
				if(json){
					var data = $.parseJSON(json);
					this._data = data;
					success(data)
					return;
				}
				
			}
			return $.ajax({
				url:  ( this.location || DOCS_LOCATION) + "searchData.json" ,
				success: this.callback(['setData', success]),
				jsonpCallback: "C",
				dataType: "jsonp",
				cache: true
			});
	
		},
		setData: function( data ) {
			this._data = data;
			var prop, doc, parents, i, len, parent;
			// go through and add children ...
			for(prop in this._data){
				doc = this._data[prop];
				parents = doc.parents || [];
				len = parents.length;
				for(var i =0; i < len; i++){
					parent = data[parents[i]];
					
					if(!parent.childDocs){
						parent.childDocs = []
					}
					// this 'should' take up less mem (but not in what's saved)
					parent.childDocs.push(doc.name);
				}
			}
			if(window.localStorage && window.JMVCDOC_TIMESTAMP){
				setTimeout(function(){
					window.localStorage["jmvcDoc"+JMVCDOC_TIMESTAMP] = $.toJSON(data)
				},1000)
				
			}
			
			return arguments;
		},
		findOne: function(params, success, error){
			if(success){
				
				if(window.localStorage && window.JMVCDOC_TIMESTAMP){
					var json = window.localStorage["jmvcDoc"+params.name]
					if(json){
						var data = $.parseJSON(json);
						if(data.timestamp == JMVCDOC_TIMESTAMP){
							success(data)
							return;
						}
					}
					
				}				
				
				return $.ajax({
					url: ( this.location || DOCS_LOCATION) + params.name.replace(/ /g, "_").replace(/&#46;/g, ".") + ".json",
					success: function(data){
						success(data);
						
						if(window.localStorage && window.JMVCDOC_TIMESTAMP){
							data.timestamp = JMVCDOC_TIMESTAMP;
							setTimeout(function(){
								window.localStorage["jmvcDoc"+params.name] = $.toJSON(data)
							},1000)
							
						}
						
						
					},
					error: error,
					jsonpCallback: "C",
					dataType: "jsonp addFavorites"
				});
			}
			
			var res;
			if(params.name){
				res = this._data[params.name]
			} 
			if( res ) {
				return new this(res);
			}
		},
		/**
		 * Used for search
		 * @param {Object} params
		 */
		findAll: function(params){
			var valWasEmpty, level = 2;
			var val = val.toLowerCase();
	
			if (!val || val === "*" ) {
				val = "home"; // return the core stuff
				valWasEmpty = true;
			}
	
			if ( val == "favorites" ) return Favorites.findAll()
	
			var current = this._data;
			for ( var i = 0; i < level; i++ ) {
				if ( val.length <= i || !current ) break;
				var letter = val.substring(i, i + 1);
				current = current[letter];
			}
			var list = [];
			if ( current && val.length > level ) {
				//make sure everything in current is ok
				var lookedup = this.lookup(current.list);
				for ( var i = 0; i < lookedup.length; i++ ) {
					if ( this.matches(lookedup[i], val, valWasEmpty) ) list.push(lookedup[i])
				}
			} else if ( current ) {
				list = this.lookup(current.list);
			}
			return list.sort(this.sortFn);
		}
	},{
		init : function(attrs){
			$.extend(this,attrs);
		},
		
		children : function(){
			var data = this.Class._data;
			//get the child docs and their order ...
			return $.map(this.childDocs, function(docName){
				return new Doc( data[docName] );
			}).sort(Search.sortFn)
		}
	});
	

$.Class('Docs',{
	findOne : function(who, success, error){
		
		return $.ajax({
			url: DOCS_LOCATION + who.replace(/ /g, "_").replace(/&#46;/g, ".") + ".json",
			success: success,
			error: error,
			jsonpCallback: "C",
			dataType: "jsonp"
		});
		
	}
},{})

$.Class('Search', {
	load: function( callback ) {

		return $.ajax({
			url: DOCS_LOCATION + "searchData.json",
			success: this.callback(['setData', callback]),
			jsonpCallback: "C",
			dataType: "jsonp",
			cache: true
		})

	},
	setData: function( data ) {
		this._data = data;
		return arguments;
	},
	find: function( val ) {
		var valWasEmpty, level = 2;
		var val = val.toLowerCase();

		if (!val || val === "*" ) {
			val = "home"; // return the core stuff
			valWasEmpty = true;
		}

		if ( val == "favorites" ) return Favorites.findAll()

		var current = this._data;
		for ( var i = 0; i < level; i++ ) {
			if ( val.length <= i || !current ) break;
			var letter = val.substring(i, i + 1);
			current = current[letter];
		}
		var list = [];
		if ( current && val.length > level ) {
			//make sure everything in current is ok
			var lookedup = this.lookup(current.list);
			for ( var i = 0; i < lookedup.length; i++ ) {
				if ( this.matches(lookedup[i], val, valWasEmpty) ) list.push(lookedup[i])
			}
		} else if ( current ) {
			list = this.lookup(current.list);
		}
		return list.sort(this.sortFn);
	},
	matches: function( who, val, valWasEmpty ) {
		if (!valWasEmpty && who.name.toLowerCase().indexOf(val) > -1 ) return true;
		if ( who.tags ) {
			for ( var t = 0; t < who.tags.length; t++ ) {
				if ( who.tags[t].toLowerCase().indexOf(val) > -1 ) return true;
			}
		}
		return false;
	},
	sortFn: function( a, b ) {
		var aHasOrder = a.order !== null,
			bHasOrder = b.order !== null
		if(aHasOrder && bHasOrder){
			return a.order - b.order;
		} 
		if( aHasOrder ){
			return -1;
		}
		if(bHasOrder){
			return 1;
		}
		
		
		//if equal, then prototype, prototype properties go first
		var aname = (a.title && a.name.indexOf(".") == -1 ? a.title : a.name).replace(".prototype", ".zzzaprototype").replace(".static", ".zzzbstatic").toLowerCase();
		var bname = (b.title && b.name.indexOf(".") == -1 ? b.title : b.name).replace(".prototype", ".zzzaprototype").replace(".static", ".zzzbstatic").toLowerCase();


		if ( aname < bname ) return -1
		else aname > bname
		return 1
		return 0;
	},
	sortJustStrings: function( aname, bname ) {
		var aname = aname.replace(".prototype", ".000AAAprototype").replace(".static", ".111BBBstatic");
		var bname = bname.replace(".prototype", ".000AAAprototype").replace(".static", ".111BBBstatic");


		if ( aname < bname ) return -1
		else aname > bname
		return 1
		return 0;
	},
	lookup: function( names ) {
		var res = [];
		for ( var i = 0; i < names.length; i++ ) {
			this._data.list[names[i]] && res.push(this._data.list[names[i]])
		}
		return res;
	}
}, {})
	
	
})
