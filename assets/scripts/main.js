/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {

        var pagesTraversed = 0,
        filter_selected,
        x = document.cookie,
        momentum = 0,
        containerStatic = $('.static'),
        innerContainerStatic = $('.static div.content'),
        targetContainer = false,
        initialState = false;

        $grid = ['featured', 'related'];

        function resetElements() {
          $('.sidebar').removeClass('open');
        }

        function mobileCheck() {
          // Check if mobile...
          if (Modernizr.mq('(max-width: 768px)')) {
              $('html').addClass('mobile');
          } else {

              resetElements();

              $('html').removeClass('mobile');




          }
        }

        function initDropdown() {
          $(".start-container > ul > li > a").trigger( "click" );
        }

        mobileCheck();

        $( window ).resize(function() {

          // Set height of controls for feed container
          var feedHeight = $('div.feed').innerHeight();
          $('.feed-ctl a').css('height', feedHeight);
          
          mobileCheck();

          resizeTasks();


        });

        $(window).load(function(e) {

          // Handle back button for history events
          $( ".cover" ).on( "click", function(e) {

            $(".bubbles").fadeOut(50);
            $(this).fadeOut();

          });


        });

        function resizeTasks() {

          if($(window).width() > $('div.feed .content').innerWidth()) {
            $('.feed-ctl').hide();
          } else {
            $('.feed-ctl').show();
          }

          //var relatedInner = $('div.related').innerWidth();
          //var relatedOffset = Number(relatedInner);

          console.log('window: ' + $(window).width());
          //console.log('element: ' +  relatedOffset);

          if(($(window).width() - 263) > $('div.related .content').innerWidth()) {
            $('.related-ctl').hide();
          } else {
            $('.related-ctl').show();
          }

        }

        function showTooltips() {

          if(!$.cookie('visited')) {
            $.cookie('visited', 'true', { expires: 3600, path: '/' });

            $(".cover").css("opacity", 0.6).fadeIn(200, function () {     
              $(".bubbles").fadeIn();
            });
          }


        }

        var $myGroup = $('#tier-group');
        $myGroup.on('show.bs.collapse', function () {
          $myGroup.find('.collapse.in').collapse('hide');
        })

        $.each( $('.tiers-container button'), function( key, value ) {
          var button = $(this);
          var element = $(this).next();

          $(element).on('hide.bs.collapse', function () {
            $('i', button).removeClass('fa-plus');
            $('i', button).addClass('fa-minus');
          });

          $(element).on('show.bs.collapse', function () {
            $('i', button).removeClass('fa-minus');
            $('i', button).addClass('fa-plus');
          })
        });

        $( ".start-container > ul > li > a" ).on( "click", function(e) {

          e.preventDefault();

          var text = $(this).children('span');
          var container = $(this).parent();
          var dropdown = $( ".start-container > ul > li > ul");

          var element = $(this);

          if (!$(container).hasClass("open")) {

            if ($(window).width() <= 500) {
              var w = '340px';
            } else {
              var w = '500px';
            }

            $('.landing-arrow').removeClass('animate-arrow');
            $('.landing-arrow').removeClass('animated');
            $('.landing-arrow').removeClass('bounce');

            $( text ).stop().fadeTo( 300 , 0, function() {

              $( container ).animate({ "width": w }, 400, function() {
                $( text ).text('What are you looking for?');
                $( text ).addClass('what');
                $( text ).stop().fadeTo( 300 , 1);

                $(container).addClass('open');
                $(container).addClass('border-fill');
                $('.landing-arrow').addClass('rotate');

                $(dropdown).addClass('dropdown');

                setTimeout(initDropdown, 250);

              });

            });

          } else {
            if ($(dropdown).hasClass("height-transition-hidden")) {
              $(dropdown).show();
              $(dropdown).slideDownTransition();
              

            } else {

              $(dropdown).slideUpTransition();
              $(dropdown).fadeOut();
              
            }

            $( container ).toggleClass( "expand" );
          }




        });



        $( ".start-container > ul > li > ul > li > a" ).on( "click", function(e) {

          e.preventDefault();

          var header_main = $('header.main-content');

          var selected_parent = $(this).parent().data('parent-slug');
          var selected_tag = $(this).parent().data('slug');

          var selected = '.checkbox-input' + '.' + selected_parent + '.' + selected_tag;

          // For collapsing tier 1 dropdown
          var tier = $('#' + selected_parent);

          console.log(selected);

          if(selected_tag == 'contribute') {
            window.location.href = "/2015/08/27/get-involved-with-cfe/";
            return false;
          }

          $(selected).prop('checked', true).trigger("change");
          $(tier).collapse('show');

          $('header.banner').fadeOut(100);

          $(header_main).addClass('content-expanded');

          $( header_main ).animate({
            'opacity':'1'
          }, 100, "linear", function() {

            $(header_main).addClass('show-cfe');

            $('body > a.brand').hide();
            $( "body" ).css( "backgroundColor", "#ffffff" );

            //setInitialState();

            setTimeout(showTooltips, 1000);
          });

        });

        // For article 'read more' links
        $(document).on( "click",  "a.clickable, article.related-item", function(e) {

          e.preventDefault();

          var data = $(this).closest('article').data();

          var articleArray = {
              articles: new Array()
          };

          articleArray.articles.push(data);

          //console.log(data);

          if(articleArray) {

            // Back/forward are never shown on single post page, so wipe them off before moving to content
            if($( ".controls" ).hasClass('toggle-show')) {
              toggleControls();
            }

            updateContent(articleArray);


            pagesTraversed += 1;

            history.pushState(articleArray, data.title, data.permalink);

          }




        });

        // Handle back button for history events
        $( ".inner a.back" ).on( "click", function(e) {

          e.preventDefault();

          window.scrollTo(0, 0);

          window.history.back();

        });

        // Handle back button for sidebar in mobile view - not a history event
        $( ".sidebar a.back" ).on( "click", function(e) {

          e.preventDefault();

          var sidebar = $('.sidebar');

          $( '.sidebar-inner' ).fadeOut( 200, function() {
            $(sidebar).removeClass('open');

            $( '.sidebar-inner' ).fadeIn();
          });

        });

        function toggleControlVisibility() {

          $( ".controls" ).each(function( index, element ) {

            if(!$('a.content-forward', this).is(':visible')) {
              $('a.content-forward', this).fadeIn();
            }

          });
        }

        function toggleControls(reset) {

          // Set height of controls for feed container
          var feedHeight = $('div.feed').innerHeight();
          $('.feed-ctl a').css('height', feedHeight);

          // Apply values to individual control elements
          $( ".controls" ).each(function( index, element ) {



            var position = $( "a.content-back", this ).css( "left" );

            if(position == '194px') {
              $( this ).addClass( "toggle-show" );
              $( "a.content-back", this ).animate({ "left": "263px" }, 50 );
            } else {
              $( this ).removeClass( "toggle-show" );
              $( "a.content-back", this ).animate({ "left": "194px" }, 50 );
              //$( "a.content-back", this ).fadeOut(100);
            }

            var position = $( "a.content-forward", element ).css( "right" );

            if(position == '-50px') {
              $( "a.content-forward", this ).animate({ "right": "0px" }, 50 );
            } else {
              $( "a.content-forward", this ).animate({ "right": "-50px" }, 50 );
              //$( "a.content-forward", this ).fadeOut(100);
            }       


            if(!$('a.content-forward', this).is(':visible')) {
              $('a.content-forward', this).fadeIn();
            }

 

          });

          // Hide sidebars if content does not overflow browser window
          resizeTasks();

        }


        function initIsotope() {
            $.each( $grid, function( i, val ) {

              if($('html').hasClass('mobile')) {
                var mode = 'vertical';
              } else {
                var mode = 'horizontal';
              }

              $grid[val] = $('.' + val + ' .content').isotope({
                itemSelector: 'article',
                layoutMode: 'horizontal',
                getSortData: {
                  position: function( itemElem ) { // function
                    var position = $( itemElem ).attr('data-position');
                    return parseFloat( position );
                  }
                },
                sortBy: 'position',
                sortAscending: true,
                filter: function() {

                  var show = ($(this).attr( "data-show-item") === "true");

                  // If true, show
                  return show;
                }
              });

              $grid[val].on( 'arrangeComplete', function( event, filteredItems ) {

                console.log('arrangeComplete');

                var articles = $('article:hidden');

                $.each(articles, function( i, val ) {

                  $(this).remove();

                });

                if(val == 'featured') {
                  featuredSwiper.update(true);
                } else {
                  relatedSwiper.update(true);
                }

                $("body").css("cursor", "auto");

              });

            });
        }

        function resetIsotope() {

            $.each( $grid, function( i, val ) {

                console.log(val);

                if($("." + val + " .content").data('isotope')) {
                  $grid[val].isotope( 'remove', $("." + val + " .content article") );
                  $grid[val].isotope( 'destroy');
                }
           
            });

            $('.inner').removeClass('grid-view');
            $('.inner').addClass('normal-view');

            $('.related-container').hide();

            $('.feed div.content article').add('.related div.content article').remove();

        } 





        // Refreshes content and run transitions after update
        var updateContent = function(data) {

          if (data) {

            if(typeof data.type == 'undefined') {
              data.type = false;
            }

            if(data.title) {
            	document.title = data.title;
            }

            $('.inner').removeClass('no-results');

            var featured_list = $('.feed article'),
            related_list = $('.related article');

            var container = $('.inner');
            var innerContainer = $('.feed div.content'),
            featured_elements = '',
            related_elements = '';

            $( '.feed article'  ).attr( "data-show-item", false );
            $( '.related article' ).attr( "data-show-item", false );
            $( '.feed article'  ).attr( "data-position", 0 );
            $( '.related article' ).attr( "data-position", 0 );      

            //$( container ).stop().animate({ "opacity": 0}, 200, function() {
            //$( container ).stop().fadeTo( 300 , 0, function() {

            if(!data.related && (data.type == 'search' || data.articles.length == 1)) {
              $('.inner').removeClass('grid-view').addClass('normal-view');

                $(innerContainerStatic).removeClass('search');

                $('.static div.content article').remove();
                $('.static div.content h5').remove();
                $('.static div.content div.no-results').remove();

                if(data.type == 'search') {

                  document.title = 'Search';

                  $(innerContainerStatic).addClass('search');

                  $('a.back', innerContainerStatic).after('<h5>Search Results: <span>"' + data.query + '"</span></h5>');

                  if(!data.articles) {
                   $('<div class="extra no-results">No results found - try another search?</div>').appendTo(innerContainerStatic);
                  }
                }
            } else {

              $(innerContainerStatic).parent().fadeOut( 20);

              $('.inner').addClass('grid-view').removeClass('normal-view');

            }

            if(data.articles) {

              if(!$('.feed div.content').is(':visible')) {
                $('.feed div.content').fadeIn();
              } 

              if(data.related) {

                if(!$('.related div.content').is(":visible")) {
                  $('.related').fadeIn();
                }

                if(!$('.related div.content').is(':visible')) {
                  $('.related div.content').fadeIn();
                } 
              }  

              $.each(data.articles.concat(data.related), function( i, val ) {

                console.log(val);

              	if(val) {

	              	// Use content specific template unless data type set
	              	if(!data.type) {

	              		// Use single post template if single result
	              		if(!data.related && data.articles.length == 1) {
	              			var template = $('#template-post').html();
	              		} else {
	              			var template = $('#template-' + val.type).html();
	              		}
	              		
	              	} else {
	              		var template = $('#template-' + data.type).html();
	              	}
	              	
	                // Convert data back to JSON when rendering templates
	                if(val.json) {
	                  if (val.json instanceof Array) {
	                    val.categories = val.json;
	                    val.json = JSON.stringify(val.json);
	                  } else {
	                    val.categories = JSON.parse(val.json);
	                    val.json = val.json;
	                  }
	                }


	                if($('.inner').hasClass('grid-view')) {

                      if(!$("." + val.type + " .content").data('isotope')) {
                        initIsotope();
                      }

	                    // Only append elements that don't exist
	                    if ($( "." + val.type + " .article-" + val.uid)[0]) {

	                      $( "." + val.type + " .article-" + val.uid ).attr('data-show-item', true);
                        $( "." + val.type + " .article-" + val.uid ).attr( "data-position", val.position );

                        if(i % 2 == 0) {
                          $( "." + val.type + " .article-" + val.uid ).addClass('t1').removeClass('t2');
                        } else {
                          $( "." + val.type + " .article-" + val.uid ).addClass('t2').removeClass('t1');
                        }

                        $grid[val.type].isotope('updateSortData');

	                    } else {

                        if(i % 2 == 0) {
                          val.elementIndex = '1';
                        } else {
                          val.elementIndex = '2';
                        }

                        var markup = Mustache.render(template, val);

                        if(val.type == 'featured') {
                          featured_elements += markup;
                        } else {
                          related_elements += markup;
                        }
                      }

                      /*if(val.type == 'featured') {
                        if(i % 2 == 0) {
                          $( "." + val.type + " .article-" + val.uid ).addClass('t1').removeClass('t2');
                        } else {
                          $( "." + val.type + " .article-" + val.uid ).addClass('t2').removeClass('t1');
                        }
                      }*/



	                } else {
                      var markup = Mustache.render(template, val);

	                    $(markup).appendTo(innerContainerStatic);
	                }

              	}


                //$(markup).appendTo(innerContainer);

              });

              if($('.inner').hasClass('grid-view')) {

                if(featured_elements) {
                  $grid['featured'].isotope( 'insert', $(featured_elements) );
                } else {
                  $grid['featured'].isotope();
                }
                
                if(related_elements) {
                  $grid['related'].isotope( 'insert', $(related_elements) );
                } else {
                  $grid['related'].isotope();
                }
              } else {

                  if(data.type == 'post') {
                    document.title = data.articles[0].title;
                  }

                  showStaticPage();

              }

            } else {

              if(data.type == 'Search') {
                showStaticPage();
              }
              
            }




          } else {
            //postTasks();
          }
        };

        // Show page with no dynamic elements
        function showStaticPage() {

          $('.text', innerContainerStatic).linkify({
            target: "_blank"
          });

          $(innerContainerStatic).parent().fadeIn( 200, function() {

              $("body").css("cursor", "auto");

              // Don't show back button on first page
              if(pagesTraversed > 1) {
                showBackBar();
              }

          });
        }

        // Run after all animations complete
        function postTasks() {
          // Show social container after content rolls in on mobile
          $('.social-container').css( 'display', 'block' );

          $("body").css("cursor", "auto");
        }

        function getArticles() {

          // Get current data if back button not present
          var articles = $('.feed div.content > article');

          var articleArray = {
              articles: new Array()
          };

          $.each( articles, function( i, val ) {

            var articleData = $(val).data();

            articleArray.articles.push(articleData);
           
          });

          return articleArray;

        }

        // For initial page
        function setInitialState() {

          var articles = getArticles();

          console.log(articles);

          if(base) {
            history.replaceState(articles, 'CFE', base);
          } else {
            history.replaceState(articles, 'CFE', '/main/');
          }
          
        }

        function showControls() {

          var articles = $('.feed div.content > article');

          if(articles.length > 2) {
            $(".controls a.content-forward").fadeIn();
          }
          
        }

        function showBackBar() {

          var element = $('.inner a.back');

          $( element ).css( "display", "block");

          if($('html').hasClass('mobile')) {
            $( element ).animate({ "height": "0px" }, "fast" );
          } else {
            $( element ).animate({ "height": "50px" }, "fast" );
          }
          
        }

        function hideBackBar() {

          var element = $('.inner a.back');

          $(element).css( "marginTop", "0px" );
          $(element).css( "marginBottom", "0px" );
          $(element).css( "height", "0px" );
          $(element).hide();
          
        }

        // Update the page content when the popstate event is called.
        window.addEventListener('popstate', function(event) {
          updateContent(event.state)
        });


        // Content scrolling
        $(".content-back").on( "click", function(e) {

          e.preventDefault();

          var element = $(this);

          var target = $(this).parent().data('target');
          var container = $('div.' + target);

          moveBack(container, 300, 250);


        });

        $(".content-forward").on( "click", function(e) {

          e.preventDefault();

          var element = $(this);

          var scroll;
          var target = $(this).parent().data('target');

          var container = $('div.' + target);

          moveForward(container, 300, 250);


        });

        function moveBack(container, push, speed) {
          var leftPos = $(container).scrollLeft();

          var controls = $(container).data('controls');

          if(speed) {
            $(container).stop().animate({scrollLeft: leftPos - push}, speed, function() {

                if(!$(container).scrollLeft()) {
                  $('.' + controls + ' a.content-back').stop().fadeOut();

                  toggleControlVisibility();
                } else {
                  //$(element).parent().find('.content-forward').fadeIn();
                  toggleControlVisibility();
                }

            });
          } else {

            $(container).scrollLeft( leftPos - push );

            if(!$(container).scrollLeft()) {
              $('.' + controls + ' a.content-back').stop().fadeOut();

              toggleControlVisibility();
            } else {
              //$(element).parent().find('.content-forward').fadeIn();
              toggleControlVisibility();
            }

          }



        }

        function moveForward(container, push, speed) {
            var leftPos = $(container).scrollLeft();

            var controls = $(container).data('controls');

            console.log(controls);

            $('.' + controls + ' a.content-back').stop().fadeIn();


            if(speed) {
              $(container).stop().animate({scrollLeft: leftPos + push}, speed, function() {

                var max = $(container)[0].scrollWidth - $(container)[0].clientWidth;
                
                if($(container).scrollLeft() == max) {
                  $('.' + controls + ' a.content-forward').stop().fadeOut();
                } else {
                  $('.' + controls + ' a.content-forward').stop().fadeIn();
                }

              });
            } else {

                $(container).scrollLeft(leftPos + push);

                var max = $(container)[0].scrollWidth - $(container)[0].clientWidth;

                if($(container).scrollLeft() == max) {
                  $('.' + controls + ' a.content-forward').stop().fadeOut();
                } else {
                  $('.' + controls + ' a.content-forward').stop().fadeIn();
                }

            }


        }

        $(".faux-tiers-container button").on( "click", function(e) {

          var sidebar = $('.sidebar');

          $( '.sidebar-inner' ).fadeOut( 200, function() {
            $(sidebar).addClass('open');

            $( '.sidebar-inner' ).fadeIn();
          });

        });


        function applyFilters() {

          var checked = $('.tiers-container input:checked'),
          total = checked.length;

          var items = [],
          term_names = [],
          tiers = {'tier-1' : [], 'tier-2' : [], 'tier-3' : []};

          if(checked) {
            $(checked).each(function (index) {

              var current_tier = $(this).data('group'),
              current_term_name = $(this).data('term-name');

              items.push($(this).data('term-id'));
              term_names.push(current_term_name);

              if(!(current_tier in tiers)) {
                tiers[current_tier] = [];
              }

              tiers[current_tier].push(current_term_name);

            });
          } 

          if(tiers) {

            $.each(tiers, function(key, value) {

              if(!value.length) {
                $('.' + key + '-list').html('');
              } else {
                var term_list = tiers[key].join(", ");

                console.log(key);
                console.log(term_list);

                $('.' + key + '-list').html('SELECTED: ' + term_list);
              }



            });
          }

          if(items) {

            var term_list = term_names.join(", ");

            $('.filters-list').html('SELECTED: ' + term_list);

            items = JSON.stringify(items);

            // Don't fire ajax request on checkbox select if mobile view
            if($(".sidebar").hasClass('open')) {
              return items;
            } else {
              getFilteredArticleList(items);

              return items;
            }

          }
        }

        function getFilteredArticleList(items) {

            $("body").css("cursor", "progress");

            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: {
                    'action' : 'get_articles',
                    'terms'  : items
                },
                success:function(data) {
                    
                    data = jQuery.parseJSON(data);

                    if(data.articles) {

                      updateContent(data);

                      pagesTraversed += 1;

                      history.pushState(data, 'Center for Entrepreneurship', data.url);

                    } else {

                      $('.inner .message p').html($('.inner .message').data('results'));
                      $('.inner').addClass('no-results');

                      $("body").css("cursor", "auto");
                    }

                },
                error: function(errorThrown){
                    console.log(errorThrown);

                    $("body").css("cursor", "auto");
                }
            });  

        }


        $(".tiers-container input").change(function() {

          filter_selected = applyFilters();

        });

       $(".tier-submit button").on( "click", function(e) {

          if(filter_selected) {
            getFilteredArticleList(filter_selected);

            $( ".sidebar a.back" ).click();
          }

        });

       $(".search .add-on").on( "click", function(e) {

          e.preventDefault();

          $(".search-form").submit();

        });

       $(".search-form").on( "submit", function(e) {

          e.preventDefault();

          $("body").css("cursor", "progress");

          var query = $('input', this).val();

          if(!query) {
            return false;
          }

          $.ajax({
              url: '/wp-admin/admin-ajax.php',
              data: {
                  'action' : 'get_articles',
                  'type'  : 'search',
                  'q' : $('input', this).val()
              },
              success:function(data) {
                  
                  data = jQuery.parseJSON(data);

                  if(data) {

                    console.log(data);

                    updateContent(data);


                    pagesTraversed += 1;
                    history.pushState(data, 'Center for Entrepreneurship', data.url);

                  }

              },
              error: function(errorThrown){
                  console.log(errorThrown);

                  $("body").css("cursor", "auto");
              }
          });  

        });



        // Set initial history state on page load if this is not the home page
        if($( "header.main-content" ).hasClass( "content-expanded" )) {

          setInitialState();

          setTimeout(showTooltips, 1000);

          $('.social-container').css( 'display', 'block' );

          var articles = $('.static div.content > article');
          var tags = [];


          if(queried_tags) {
            var tags = queried_tags.split(",").map(function(t){return parseInt(t)});

            if(tags) {

              //var tagsJSON = JSON.stringify(tags);

              $.each( tags, function( i, val ) {

                $('.tiers-container input.checkbox-input[data-term-id="' + val + '"]').prop('checked', true);
               
              });

              $(".tiers-container div.collapse:first-of-type").collapse('toggle');
              
              // Run filters
              filter_selected = applyFilters();

              //getFilteredArticleList(tagsJSON);
            }



          } else if(!queried_tags && !articles) {
            $(".tiers-container div.collapse:first-of-type").collapse('toggle');
            $('.checkbox-input.whats-cfe').prop('checked', true).trigger("change");
          } else {
            $(".tiers-container div.collapse:first-of-type").collapse('toggle');

            showStaticPage();
          }
        }

        var featuredSwiper = $('.featured .swiper-featured').swiper({
          //Your options here:
          mode: 'horizontal',
          slidesPerView: 'auto',
          centeredSlides: false,
          paginationClickable: true,
          spaceBetween: 0,
          mousewheelControl: true,
          freeMode: true
        });

        var relatedSwiper = $('.related .swiper-related').swiper({
          //Your options here:
          mode: 'horizontal',
          slidesPerView: 'auto',
          centeredSlides: false,
          paginationClickable: true,
          spaceBetween: 0,
          mousewheelControl: true,
          freeMode: true
        });

        $(window).load(function() { 

          $(".well").mCustomScrollbar({
              axis:"y",
              theme: "light",
              scrollInertia: 300
          });

          $(".tiers-container").mCustomScrollbar({
              axis:"y",
              theme: "light",
              scrollInertia: 300
          });


          if(document.referrer.indexOf(location.protocol + "//" + location.host) === 0)  {

            if($('.inner').hasClass('normal-view')) {
              showBackBar();
            }
            
          }


        });


        var regEx = /(\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*)/g;

        $('.address span, article.post .text, .sidebar-bottom a.newsletter').linkify({
          target: "_blank"
        });

        if($('body').hasClass('error404')) {
          $('.inner .message p').html($('.inner .message').data('error'));
          $('.inner').addClass('no-results');
        }

      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
