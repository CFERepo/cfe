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
        containerStatic = $('.static'),
        innerContainerStatic = $('.static div.content'),
        targetContainer = false,
        initialState = false,
        featuredSwiper = false,
        relatedSwiper = false;

        var swipeSettings = {
          mode: 'horizontal',
          slidesPerView: 'auto',
          centeredSlides: false,
          paginationClickable: true,
          spaceBetween: 0,
          mousewheelControl: true,
          freeMode: true,
          keyboardControl: true,
          nextButton: 'a.content-forward',
          prevButton: 'a.content-back',
          resistanceRatio: 0
        };

        var s1 = {
          nextButton: '.feed-ctl a.content-forward',
          prevButton: '.feed-ctl a.content-back'
        };

        var s2 = {
          nextButton: '.related-ctl a.content-forward',
          prevButton: '.related-ctl a.content-back'
        };

        var featuredSwipeSettings = $.extend({}, swipeSettings, s1),
        relatedSwipeSettings = $.extend({}, swipeSettings, s2);

        var isotopeSettings = {
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
        };

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

        function resetSwiper() {
          if($('html').hasClass('mobile')) {

            if(featuredSwiper) {
              featuredSwiper.destroy();

              featuredSwiper = false;
            }

            if(relatedSwiper) {
              relatedSwiper.destroy();

              relatedSwiper = false;
            }

          } else {
            if(!featuredSwiper) {
              initFeaturedSwiper();
            }

             if(!relatedSwiper) {
              initRelatedSwiper();
            }           
          }
        }

        function initFeaturedSwiper() {
          featuredSwiper = $('.featured .swiper-featured').swiper(featuredSwipeSettings);

          featuredSwiper.on('onSetTranslate', function (swiper, translate) {

            if(swiper.isBeginning) {
              swiper.updateClasses();
            }

            if(swiper.isEnd) {
              swiper.updateClasses();
            }

          });

        }

        function initRelatedSwiper() {
          relatedSwiper = $('.related .swiper-related').swiper(relatedSwipeSettings);

          relatedSwiper.on('onSetTranslate', function (swiper, translate) {

            if(swiper.isBeginning) {
              swiper.updateClasses();
            }

            if(swiper.isEnd) {
              swiper.updateClasses();
            }

          });
        }

        function resetGrid() {
          if($('html').hasClass('mobile')) {

            $.each( $grid, function( i, val ) {

                $grid[val].isotope({layoutMode : 'vertical'});
           
            });

          } else {
            $.each( $grid, function( i, val ) {

                isotopeSettings.layoutMode = 'horizontal';

                $grid[val].isotope({layoutMode : 'horizontal'});
           
            });
          }
        }

        function initDropdown() {
          $(".start-container > ul > li > a").trigger( "click" );
        }

        mobileCheck();

        $( window ).resize(function() {
          
          mobileCheck();

          resetGrid();

          resetSwiper();


        });

        $(window).load(function(e) {

          // Handle back button for history events
          $( ".cover" ).on( "click", function(e) {

            $(".bubbles").fadeOut(50);
            $(this).fadeOut();

          });


        });

        function showTooltips() {

          if(!$.cookie('visited')) {
            $.cookie('visited', 'true', { expires: 3600, path: '/' });

            $(".cover").css("opacity", 0.6).fadeIn(200, function () {     

              if($('html').hasClass('mobile')) {
                $(".bubbles.mobile").fadeIn();
              } else {
                $(".bubbles.full").fadeIn();
              }
              
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
            $('i', button).removeClass('fa-minus');
            $('i', button).addClass('fa-plus');
          });

          $(element).on('show.bs.collapse', function () {
            $('i', button).removeClass('fa-plus');
            $('i', button).addClass('fa-minus');
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

          //console.log(selected);

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
              articles: new Array(),
              type: 'post'
          };

          if(data && data.permalink) {

            var test;

            var parts = data.permalink.split("/"),
            path = parts[parts.length - 2];

            if(path == 'techlab') {
              window.location.href = '/techlab/';
              return;
            }

          }

          articleArray.articles.push(data);

          //console.log(data);

          if(articleArray) {

            updateContent(articleArray);


            pagesTraversed += 1;

            history.pushState(articleArray, data.title, data.permalink);

          }




        });

        // Handle deselect
        $( "a.deselect" ).on( "click", function(e) {

          e.preventDefault();

          // Reset to default state
          $('.tiers-container input').prop('checked', false);

          applyFilters();

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

        function resetMenuVisibility() {
            $('.tiers-container').removeClass('loading');
            $('.tiers-container :input').prop("disabled", false);
        }

        function initIsotope() {
            $.each( $grid, function( i, val ) {

              if($('html').hasClass('mobile')) {
                isotopeSettings.layoutMode = 'vertical';
              } else {
                isotopeSettings.layoutMode = 'horizontal';
              }

              $grid[val] = $('.' + val + ' .content').isotope(isotopeSettings);

              $grid[val].on( 'arrangeComplete', function( event, filteredItems ) {

                //console.log('arrangeComplete');

                var articles = $('article:hidden');

                $.each(articles, function( i, val ) {

                  $(this).remove();

                });

                if(val == 'featured') {

                  if(featuredSwiper) {
                    featuredSwiper.update(true);
                  } else {

                    // ONLY re-init swiper if desktop
                    if(!$('html').hasClass('mobile')) {
                      initFeaturedSwiper();
                    }

                  }
                  
                } else {

                  if(relatedSwiper) {
                    relatedSwiper.update(true);

                    // Initialize swiper if it previously was not due to display: none
                    if($('.related .content').height() == 0) {
                      $('.related .content').css('height', '150px');
                      initRelatedSwiper();
                    }

                  } else {
                    if(!$('html').hasClass('mobile')) {
                      initRelatedSwiper();
                    }
                  }

                }

                $("body").css("cursor", "auto");

                resetMenuVisibility();

              });

            });
        }

        function resetIsotope() {

            $.each( $grid, function( i, val ) {

                //console.log(val);

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

            // Defaults
            $( '.feed article'  ).attr( "data-show-item", false );
            $( '.related article' ).attr( "data-show-item", false );
            $( '.feed article'  ).attr( "data-position", 0 );
            $( '.related article' ).attr( "data-position", 0 );     

            window.scrollTo(0, 0); 

            // Loop through and ensure all selected tags marked as checked in case of user hitting back button
            if(data.selected_terms) {
              var reference = data.selected_terms.split(",");

              // Reset to default state
              $('.tiers-container input').prop('checked', false);

              $( reference ).each(function( i, value ) {
                $('.tiers-container input[data-term-id="' + value + '"]').prop('checked', true);
              });

              // Update selected
              applyFilters();

            }

            if(!data.related && (data.type == 'search' || data.articles.length == 1)) {
              $('.inner').removeClass('grid-view').addClass('normal-view');

                // Set up some data type specific classes/markup before content is placed
                $(innerContainerStatic).removeClass('search');

                $('.static div.content article').remove();
                $('.static div.content h5').remove();
                $('.static div.content div.no-results').remove();
                $('.static div.content div.pagination').remove();

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

	                } else {
                      var markup = Mustache.render(template, val);

	                    $(markup).appendTo(innerContainerStatic);
	                }

              	}


                //$(markup).appendTo(innerContainer);

              });

              if($('.inner').hasClass('grid-view')) {

                if(featured_elements || related_elements) {
                  // Update swiper positions, only if new content was inserted
                  if(featuredSwiper) {
                    featuredSwiper.slideTo(0, 300, true);
                  }

                  if(relatedSwiper) {
                    relatedSwiper.slideTo(0, 300, true);
                  }
                }
 
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

                    // Update WP admin bar
                    updateAdminBar(data.articles[0]);
                  }

                  // Append pagination widget
                  if(data.type == 'search') {

                    if(data.pagination) {
                      $('<div class="pagination">' + data.pagination + '</div>').appendTo(innerContainerStatic);

                      $('.pagination').children().each(function () {    
                          var page = $(this).html();
                          var current = $('.page-numbers.current').html();

                          if($(this).hasClass( "next" )) {
                            $(this).attr('data-page', parseInt(current) + 1);
                          } else if($(this).hasClass( "prev" )) {
                            $(this).attr('data-page', parseInt(current) - 1);
                          } else {
                            $(this).attr('data-page', page);
                          }
                      });
                    }

                  }

                  showStaticPage();

              }

            } else {

              // No results page for Search
              if(data.type == 'search') {
                showStaticPage();
              }
              
            }




          } else {
            //postTasks();
          }
        };

        // Update Admin Bar
        function updateAdminBar(article) {

          var link = '/wp-admin/post.php?post=' + article.uid + '&action=edit';

          //console.log(link);

          if(!$('#wp-admin-bar-root-default #wp-admin-bar-edit').length) {
            $('#wp-admin-bar-root-default').append('<li id="wp-admin-bar-edit"><a class="ab-item" href="' + link + '">Edit Post</a></li>');
          } else {
            $('#wp-admin-bar-root-default #wp-admin-bar-edit a').attr("href", link);
            $('#wp-admin-bar-root-default #wp-admin-bar-edit a').html('Edit Post');
          }

        }

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

              resetMenuVisibility();

          });
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

          //console.log(articles);

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


        function moveBack(container, push, speed) {
          var leftPos = $(container).scrollLeft();

          var controls = $(container).data('controls');

          if(speed) {
            $(container).stop().animate({scrollLeft: leftPos - push}, speed, function() {

                if(!$(container).scrollLeft()) {
                  $('.' + controls + ' a.content-back').stop().fadeOut();
                }

            });
          } else {

            $(container).scrollLeft( leftPos - push );

            if(!$(container).scrollLeft()) {
              $('.' + controls + ' a.content-back').stop().fadeOut();
            }

          }



        }

        function moveForward(container, push, speed) {
            var leftPos = $(container).scrollLeft();

            var controls = $(container).data('controls');

            //console.log(controls);

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

                //console.log(key);
                //console.log(term_list);

                $('.' + key + '-list').html('SELECTED: ' + term_list);
              }



            });
          }

          if(items) {

            var term_list = term_names.join(", ");

            $('.filters-list').html('SELECTED: ' + term_list);

            return items;

          } else {
            return false;
          }
        }

        function getFilteredArticleList(items, redirect) {

            $("body").css("cursor", "progress");

            //console.log('testing');

            items = JSON.stringify(items);

            $.ajax({
                url: '/wp-admin/admin-ajax.php',
                data: {
                    'action' : 'get_articles',
                    'terms'  : items
                },
                success:function(data) {
                    
                    data = jQuery.parseJSON(data);

                    if(data.articles) {

                      if(!pagesTraversed) {
                        history.replaceState(data, 'Center for Entrepreneurship', data.url);
                      } else {
                        history.pushState(data, 'Center for Entrepreneurship', data.url);
                      }

                      pagesTraversed += 1;

                      if(redirect) {
                        // Refresh page on mobile only
                        window.location.href = data.url;
                        return false;
                      } else {

                        updateContent(data);
                      }


                    } else {

                      $('.inner .message p').html($('.inner .message').data('results'));
                      $('.inner').addClass('no-results');

                      $("body").css("cursor", "auto");

                      $('.tiers-container :input').prop("disabled", false);
                      $('.tiers-container').removeClass('loading');
                    }

                },
                error: function(errorThrown){
                    //console.log(errorThrown);

                    $("body").css("cursor", "auto");

                    $('.tiers-container :input').prop("disabled", false);
                    $('.tiers-container').removeClass('loading');
                }
            });  

        }


        $(".tiers-container input").change(function() {

          if(!$('html').hasClass('mobile')) {
            $('.tiers-container :input').prop("disabled", true);
            $('.tiers-container').addClass('loading');
          }

          filter_selected = applyFilters();

          // Fire ajax request immediately on mobile when input clicked
          if(!$(".sidebar").hasClass('open')) {
            getFilteredArticleList(filter_selected, false);
          }

        });

       $(".tier-submit button").on( "click", function(e) {

          if(filter_selected) {
            getFilteredArticleList(filter_selected, true);

            $( ".sidebar a.back" ).click();
          }

        });

       $(".search .add-on").on( "click", function(e) {

          e.preventDefault();

          $(".search-form").submit();

        });

       $(".search-form").on( "submit", function(e) {

          e.preventDefault();

          var query = $('input', this).val();

          if(!query) {
            return false;
          }

          articleSearch(query);

        });

        // Handle pagination links
        $(document).on( "click",  ".pagination a", function(e) {

          e.preventDefault();

          window.scrollTo(0, 0);

          var query = $('#s').val();
          var page = $(this).attr('data-page');

          articleSearch(query, page);

        });

        function articleSearch(query, current_page) {

          current_page = (typeof current_page !== 'undefined') ? current_page : null;

          if(!current_page) {
            current_page = 1;
          }

          $("body").css("cursor", "progress");

          $.ajax({
              url: '/wp-admin/admin-ajax.php',
              data: {
                  'action' : 'get_articles',
                  'type'  : 'search',
                  'q' : query,
                  'current_page' : current_page
              },
              success:function(data) {
                  
                  data = jQuery.parseJSON(data);

                  if(data) {

                    if(!pagesTraversed) {
                      history.replaceState(data, 'Center for Entrepreneurship', data.url);
                    } 

                    pagesTraversed += 1;

                    history.pushState(data, 'Center for Entrepreneurship', data.url);

                    updateContent(data);

                  }

              },
              error: function(errorThrown){
                  //console.log(errorThrown);

                  $("body").css("cursor", "auto");
              }
          });  
        }



        // Set initial history state on page load if this is not the home page
        if($( "header.main-content" ).hasClass( "content-expanded" )) {

          setTimeout(showTooltips, 1000);

          var articles = $('.static div.content > article');
          var tags = [];

          var field = 's',
          url = window.location.href;

          if(url.indexOf('?' + field + '=') != -1) {

            $(".tiers-container div.collapse:first-of-type").collapse('toggle');

            var s = getParameterByName('s');

            if(s) {
              articleSearch(s);
            }

          } else {

            setInitialState();

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

                getFilteredArticleList(filter_selected, false);

                //getFilteredArticleList(tagsJSON);
              }



            } else if(!queried_tags && !articles) {
              $(".tiers-container div.collapse:first-of-type").collapse('toggle');
              $('.checkbox-input.whats-cfe').prop('checked', true);

              filter_selected = applyFilers();

              getFilteredArticleList(filter_selected, false);

            } else {
              $(".tiers-container div.collapse:first-of-type").collapse('toggle');

              showStaticPage();
            }

          }


        }

        function getParameterByName(name) {
            name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
            var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
                results = regex.exec(location.search);
            return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
        }

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


        // Test
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
