/**
 * @tag home
 * 
 * Runs the documentation
 */
jQuery.Controller.extend('DocumentationController',
/* @Static */
{
    onDocument: true
},
/* @Prototype */
{
     /**
      * Keeps track of who is selected
      */
     init: function(){
        this.selected = [];
     },
     /**
      * Searches with the current value in #search or searches for 'home'
      */
     searchCurrent : function(){
         this.search( $('#search').val() || "" );
     },
     /**
      * Searches for a value and puts results on the left hand side
      * @param {Object} val
      */
     search : function(val){
	 	if(val == "Search API") {
			val = "";
		}
        var list = Search.find(val);
        this.selected = [];
        $("#left").html("//jmvcdoc/views/results.ejs", 
                         {list: list, selected: this.selected, hide: false},
                         DocumentationHelpers)
     },
     showDoc : function(docData){
         $("#doc").html("//jmvcdoc/views/"+docData.type.toLowerCase()+".ejs",
                             docData,
                           DocumentationHelpers
                        ).find("h1.addFavorite").
                            append('&nbsp;<span class="favorite favorite'+ (docData.isFavorite? 'on' : 'off')+'">&nbsp;&nbsp;&nbsp;</span>') ;
         //setTimeout(function(){
             $("#doc_container").scrollTop(0)
         //},100);
         $("#doc code").highlight();
         //check for api
         if($("#api").length){
             var names = [];
             for(var name in Search._data.list){
                 names.push(name)
             }
             $("#api").html(  
                 DocumentationHelpers.link("["+names.sort(Search.sortJustStrings).join("]<br/>[")+"]" , true )   
             )
         }
         
		 
	 	 // cleanup iframe menu when navigating to another page
	 	 if($(".iframe_menu_wrapper").length) $(".iframe_menu_wrapper").remove();
		 
		 // hookup iframe ui
		 var $iframe_wrapper = $(".iframe_wrapper");
         if ($iframe_wrapper.length) $iframe_wrapper.iframe();		 
		 
		 // hookup demo ui
		 var $demo_wrapper = $(".demo_wrapper");
         if ($demo_wrapper.length) $demo_wrapper.demo();
		 
		 // add image
		 var $image_wrapper = $(".image_wrapper");
         if ($image_wrapper.length) $image_wrapper.image();
		 
		 // add disqus comments
	 	 $("#disqus_thread").children().remove();
		 if(docData.name != "index" && typeof(COMMENTS_LOCATION) != "undefined" && $("#disqus_thread").length) {
			window.disqus_title = docData.name;
			// can't use subdomains or hashes
			var subdomain = location.href.match(/\/\/(.*\.)\w*\.\w*\//), 
				disqus_url = location.href
			if(subdomain){
				disqus_url = location.href.replace(subdomain[1], "");
			}
			window.disqus_url = disqus_url.replace(/\#/, '');
			window.disqus_identifier = window.disqus_url;
			steal.insertHead(COMMENTS_LOCATION);
		 }
     },
          
     showResultsAndDoc : function(searchResultsData, docData){
         $("#left").html("//jmvcdoc/views/results.ejs",
                                     searchResultsData,
                                      DocumentationHelpers)
         $("#results").slideDown("fast");
         this.showDoc(docData)
     },
     show: function(who, data){
        this.who = {name: data.name, shortName: data.shortName, tag: data.name};
        data.isFavorite = Favorites.isFavorite(data);
        if(data.children && data.children.length){ //we have a class or constructor
            this.selected.push(data);
			
            var list = $.grep(Search.lookup(data.children), function(item){
				return item.hide !== true;
			}).sort(Search.sortFn)
            var self = this;
            var results = $("#results");
            if(results.length){
                $("#results").slideUp("fast",
                    this.callback(  "showResultsAndDoc",
                                    {list: list, selected: this.selected, hide: true}, 
                                    data));
            }else{
                this.showResultsAndDoc({list: list, selected: this.selected, hide: true}, data)
            }
        }else{ //we have a function or attribute
            //see if we can pick it
            if($("#results a").length == 0){
                //we should probably try to get first parent as result, but whatever ...
                $("#left").html("//jmvcdoc/views/results.ejs",
                                     {list: Search.find(""), selected: this.selected, hide: false},
                                     DocumentationHelpers)
            }
            $(".result").removeClass("picked")
            $(".result[href=#&who="+who+"]").addClass("picked").focus()
            this.showDoc(data)

        }
            
    },
    //event handlers
    "#search focus" : function(el, ev){
		if (el.val() == "Search API") {
			el.val("").removeClass('notFocused')
		}
    },
    "#search blur" : function(el, ev){
		if(!el.val()){
			el.val("Search API").addClass('notFocused');
		}
    },
    "#search keyup" : function(el, ev){
        if(ev.keyCode == 40){ //down
            var n = $('#results a:first');
			while(n && this._isInvalidMenuItem(n)){
				n = n.next("a");
			}
            n[0].focus();
        }
        else if(ev.keyCode == 13){
            window.location.hash = $('#results a:first').attr("href")
        }
        else{
            if(this.skipSet){
                this.skipSet = false;
                return 
            }
            window.location.hash = "#"
            this.search(el.val());
            $('#results a:first').addClass("highlight");
        }
            
    },
	_isInvalidMenuItem: function(el){
		return (el.hasClass("prototype") || el.hasClass("static"))
	},
	_highlight: function(el){
		if (!this._isInvalidMenuItem(el)) {
			el.addClass("highlight")
		}
	},
    "#results a focus" : function(el){ 
		this._highlight(el)
    },
    "#results a blur" : function(el){ 
        el.removeClass("highlight")
    },
    "#results a mouseover" : function(el){ 
		this._highlight(el)
    },
    "#results a mouseout" : function(el){ 
        el.removeClass("highlight")
    },
    "#results a keyup" : function(el,ev){ 
        if(ev.keyCode == 40){ //down
            var n = el.next();
			while(n && this._isInvalidMenuItem(n)){
				n = n.next("a");
			}
            if(n.length) n[0].focus();
            ev.preventDefault();
        }  
        else if(ev.keyCode == 38){ //up
            var p = el.prev("a");
			while(p && this._isInvalidMenuItem(p)){
				p = p.prev("a");
			}
            if(p.length)
                p[0].focus()
            else{
                this.skipSet = true;
                $("#search")[0].focus();
            }  
            ev.preventDefault();
        }
        else if(ev.keyCode == 13){ // enter
            window.location.hash = el.attr("href")
        }
    },
    "#results a keydown" : function(el,ev){
		ev.preventDefault();
	}, 
    ".remove click" : function(el, ev){
        ev.stopImmediatePropagation();
        this.selected.pop();
        //fire to history
        if(this.selected.length){
            var who = this.selected.pop().name;
            $("#results").slideUp("fast", function(){
                window.location.hash = "#&who="+who;
            })
        }else{
            var self = this;
            $("#results").slideUp("fast", function(){
                window.location.hash = "#"
            })
        }
    },
    ".favorite click" : function(el){
        var isFavorite = Favorites.toggle(this.who)
        if(isFavorite){
            el.removeClass("favoriteoff")
            el.addClass("favoriteon")
        }else{
            el.removeClass("favoriteon")
            el.addClass("favoriteoff")
        }
    },
    "history.favorites.index subscribe" : function(called, data){
        this.selected = [];
        $("#search").val("favorites")
        var list = Favorites.findAll();
        $("#left").html("//jmvcdoc/views/results.ejs",
                                     {list: list, selected: this.selected, hide: false},
                                     DocumentationHelpers)
        if(!list.length)
            $('#doc').html("//jmvcdoc/views/favorite.ejs",{})
    },

    ready : function(){
        /*var self = this;
        this.find("#documentation").phui_filler({parent: $(window)});
        this.find("#bottom").phui_filler();
        this.find("#bottom").bind("resize", function(){
            var h = $(this).height();
            self.find("#left").height(h);
            self.find("#doc_container").height(h);    
        });*/    
        
        this.loaded = true;
        hljs.start();
        this.loadText = $("#search").val();
        
        $("#search").val("Loading ...")
		Search.load(this.callback('setSearchReady'));
    },
    setSearchReady : function(){
        this.searchReady = true;
        //do what you would normally do
        $("#search").attr('disabled', false)

        $("#search").val(this.loadText).focus();
		if(this.loadHistoryData){
			//need a timeout to allow reset of C function
			//by jQuery
			var self= this;
			setTimeout(function(){
				self.handleHistoryChange(self.loadHistoryData);
			},1)
		}        

    },
    
    handleHistoryChange : function(data){

		if(data.search){
            $("#search").val(data.search);
            this.searchCurrent();
            if(!data.who) return;
        }
        if(!data.who){
            this.searchCurrent();
            
            if(this.who) return;
            
            data.who = "index"
        }
        var who = data.who;
        //might need to remove everyone under you from selected
        for(var i =0; i < this.selected.length; i++){
            if(this.selected[i].name == who){
                this.selected.splice(i,this.selected.length - i)
                break;
            }
        }

        $.ajax({
            url: DOCS_LOCATION + who.replace(/ /g, "_").replace(/&#46;/g, ".") + ".json",
            success: this.callback('show', who),
            error: this.callback('whoNotFound', who),
            jsonpCallback: "C",
            dataType: "jsonp"
        });
    },

	/**
	 * A history event.  Only want to act if search data is available.
	 */
	"history.index subscribe" : function(called, data){
		
		if(!this.searchReady){ //if search is not ready .. wait until it is
			this.loadHistoryData = data;
            return;
        }
        this.handleHistoryChange(data)
    },
    whoNotFound : function(who) {
        var parts = who.split(".");
        parts.pop();
        if(parts.length) {
            who = parts.join(".");
            $.ajax({
                url: DOCS_LOCATION + who.replace(/ /g, "_").replace(/&#46;/g, ".") + ".json",
                success: this.callback('show', who),
                error: this.callback('whoNotFound', who),
                jsonpCallback: "C",
                dataType: "jsonp"
            });            
        }
    }
    
}
);


$.fn.highlight = function(){
    this.each(function(){
        hljs.highlightBlock(this)
    })
    return this;
}
