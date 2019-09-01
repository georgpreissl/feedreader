


// $(document).ready(function(){
	
$(window).load(function() {



		var debug = true;
		var nrMaxEntriesPerFeed = 10;
		var nrEntries = 0;

		var arFeed=[];
		var nrFeedToLoad=0;
		var menuHtml ="";
		var arFeedTitles = "Politik Wirtschaft Sport Wissenschaft Recht Tech".split(' ');
			//others: home Meingeld Europa Panorama Kultur Leben Tech Bildung Gesundheit Spectrum Meinung
		/*
			'http://jquery.com/blog/feed/',
			'http://feeds.feedburner.com/JohnResig',
			'http://www.stilbuero.de/feed/atom/',
			'http://www.learningjquery.com/feed/',
			'http://feeds.feedburner.com/premiumpixels',
		*/



		google.load("feeds", "1");
		google.setOnLoadCallback(function() {
			// console.log(666);
			loadOneFeed(nrFeedToLoad);
		});


		function loadOneFeed(nrFeedToLoad) {
			var feedUrl = "http://diepresse.com/rss/"+arFeedTitles[nrFeedToLoad];
			// console.log(feedUrl);
		    var feed = new google.feeds.Feed(feedUrl);
		    console.log(feed);
		    feed.load(function(result) {
		        if (!result.error) {
		            var nrAvailableEntries = Math.min(result.feed.entries.length, nrMaxEntriesPerFeed);

		            menuHtml += "<li >\
									<a \
										class='menuItem' \
										data-nrFirstEntry='"+ nrEntries +"'\
										data-nrentries='"+ nrEntries +"' \
										href='#' \
									>" + arFeedTitles[nrFeedToLoad] + "</a>\
								</li>";

		            
		            for (var i = 0; i < nrAvailableEntries; i++) {
		            	nrEntries++;
		            	obEntry = result.feed.entries[i];
		                arFeed.push({
		                	feedTitle : arFeedTitles[nrFeedToLoad],
		                	entryTitle : obEntry.title,
		                	entryContent : obEntry.content,
		                	entryLink : obEntry.link
		                });
		            }

		            nrFeedToLoad++;
		            nrFeedToLoad < arFeedTitles.length ? loadOneFeed(nrFeedToLoad) : init();

		        };
		    });
		};

	function init(){

		console.log('Var: ','init');

		$('#loader').fadeOut('fast',function(){
			$(this).remove();
		})
		$('body').addClass('introActive');
		
		$('#intro h1').fitText(1);
		$('#intro h2').fitText(1.8);

		$menu = $('#menu');
		$pull = $('#pull');
		$feedsWrap = $('#feedWrap');
		$intro = $('#intro');
		$introWrap = $('#introWrap');
		
		$menu.append(menuHtml);	
		$('<img/>').attr('src','bu_ho.png'); // preloading um Zucken bei hover zu vermeiden!
		$('<img/>').attr('src','bu_ac.png'); // preloading um Zucken bei active zu vermeiden!
		var introActive = true;
		var feedNr = 0;

		var fadeDuration = 200;
		initKeys();
		
		$introWrap.on('touchstart click', start);
		
		if(debug){
			$introWrap.trigger('click');	
			fadeDuration = 0;	
		}

		
		
		//$('#intro').hide();
		//introActive=false;
		//$('#bg, #menu, .nav, #feedWrap').show();
		


	    function start() {
			console.log('arFeed: ',arFeed);
			console.log('Wissenschaft-Length: ',arFeed[3].length);
			console.log('Recht-Length: ',arFeed[4].length);
			introActive = false;
	/*
	        $introWrap.fadeOut(fadeDuration,"swing", function() {
				$menu.fadeIn(fadeDuration,"swing",function(){
					$feedsWrap.fadeIn(fadeDuration,'swing',function(){
						$('.nav').fadeIn();
						//$pull.fadeIn();				
					})	
				})
	        })
	*/
			$('body').addClass('feedActive').removeClass('introActive');

	//    	$('#menu > li').eq(nr).addClass('active').siblings().removeClass('active');
			$pull.text(arFeed[0].feedTitle);
	   	
	        nrCurrentEntry = 0;
	        $('.prev').addClass('inactive');
			$('.next').removeClass('inactive');
			stFeedsHtml = "";

			

			for (i = 0; i < nrEntries; i++) {
				obEntry = arFeed[i];
				stFeedsHtml += '<div class="entry '+ obEntry.feedTitle.toLowerCase() +'">\
					<div class="entryInner">\
						<a class="entryLink" href=' + obEntry.entryLink + ' target="blank" >\
							<h1 class="entryTitle">' + obEntry.entryTitle + '</h1>\
							<p class="entryContent" >' + obEntry.entryContent + '</p>\
						</a>\
					</div>\
				</div>';
			}
			
	        $('#feed').append(stFeedsHtml);

			
			adjustSizes();
			

			$(window).resize(function(e){
				adjustSizes();
			})

			setTimeout(function(){
		
				$('.entry').each(function(i,el){
					if($(this).outerWidth() > feedsWrapWidth){
						$(this).find("h1").addClass('break_all');
			// 			console.log('width: ',$(this).outerWidth());
				
					}
				});
			},500)

			
			$('#menu >li').first().addClass("active");
			
	        $('#menu >li').on('click', function(e){

	        	e.preventDefault();
	        	$(this).addClass("active").siblings().removeClass("active");
				$('body').removeClass('menuActive');
	            nrCurrentEntry = $(this).find("a").data("nrfirstentry");
	            $('#feed').css('marginLeft', feedsWrapWidth * nrCurrentEntry *-1 +'px');
	            $('#pull').text(arFeed[nrCurrentEntry].feedTitle);
	        });
	    }





		function adjustSizes(){
			console.log('Var: ','adjustSizes');
		//         $('.entryTitle').fitText(1.5);
		//  		$('.menuItem').fitText(2.5);
		//  		$('.entryContent').fitText(3);
			var ww = $(window).width();
			menuHeight = $menu.height();
		
			console.log('WindowHeight: ',$(window).height());
			feedsWrapWidth = $feedsWrap.width();
			feedsWrapHeight = $feedsWrap.height();
			console.log('feedsWrapWidth: ',feedsWrapWidth);
			console.log('feedsWrapHeight: ',feedsWrapHeight);

			$('#pull').on('touchstart mousedown', function(e){
				$('body').addClass('menuActive');

			});
		

			$('.entry').outerWidth(feedsWrapWidth);
			console.log('nrCurrentEntry: ',nrCurrentEntry);
			$('#feed').css('marginLeft', '-'+feedsWrapWidth*(nrCurrentEntry-1)+'px')
			console.log('marginLeft of #feed: ',$('#feed').css('marginLeft'));
		}
	    
		function initKeys(){
			$(window).keydown(function(e){
				if(introActive){
					$introWrap.trigger('click');
				} else {
					
					e.keyCode == 39 ? $('.next').trigger('click') : null;
					e.keyCode == 37 ? $('.prev').trigger('click') : null;
					if(e.keyCode == 38) {
						$('#menu').find("li.active").prev().trigger('click');
					}
					if(e.keyCode == 40){
						$('#menu').find("li.active").next().trigger('click');
				
					};		
				}

			});

		}

	    $('.next').on('click', function(e){
		
	        e.preventDefault();
	        if (nrCurrentEntry < (nrEntries-1)) {
	            nrCurrentEntry++;
				// console.log('nrEntries: ',nrEntries);
				// console.log('nrCurrentEntry: ',nrCurrentEntry);
	            $('#feed').css('marginLeft', '-='+feedsWrapWidth+'px')
	            $('#pull').text(arFeed[nrCurrentEntry].feedTitle);

	        } else {

	            $('#feed').css('marginLeft', '-=20px');
	            setTimeout(function() {
	                $('#feed').css('marginLeft', '+=20px');

	            }, 500)
	        }
	        console.log('nrCurrentEntry: ',nrCurrentEntry);
	        if(nrCurrentEntry === nrEntries){
	        	$('.next').addClass('inactive');
	        } else {
	        	$('.next, .prev').removeClass('inactive');
	        	
	        }
	        
	    });
	    
	    $('.prev').on('click', function(e){
		

	        e.preventDefault();
	        if (nrCurrentEntry > 1) {
	            nrCurrentEntry--;

	            $('#feed').css('marginLeft', '+='+feedsWrapWidth+'px')
	            $('.next').removeClass('inactive');
	            $('#pull').text(arFeed[nrCurrentEntry].feedTitle);
	            
	        } else {
	          //  $('.prev').addClass('inactive');

	            $('#feed').css('marginLeft', '+=20px');
	            setTimeout(function() {
	                $('#feed').css('marginLeft', '-=20px');

	            }, 500)
	        }
	        console.log('nrCurrentEntry: ',nrCurrentEntry);
	        if(nrCurrentEntry === 1){
	        	$('.prev').addClass('inactive');
	        } else {
	        	console.log('Var: ','nrCurrentEntry ist größer als 1');
	        	$('.prev').removeClass('inactive');
	        	
	        }
	    })

	//});
	}


});