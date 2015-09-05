<?php

$queried_tags = false;
$view = false;

if(is_home()) {
  $base = false;

  $view = 'grid-view';
} else if(is_single()) {
  $base = get_permalink();

  $view = 'normal-view';
} else if(is_category()) {
  $base = get_site_url() . '/tags/' . $wp_query->query['category_name'] . '/';

  $tag_ids = array();
  $tag_lookup = explode(",", $wp_query->query['category_name']);

  foreach( $tag_lookup as $item ) {
      $tag = get_term_by( 'slug', $item, 'category' );
      $tag_ids[] = $tag->term_id;
  }

  if($tag_ids) {
    $queried_tags = implode(",", $tag_ids);
  } else {
    $queried_tags = false;
  }

  $view = 'grid-view';
  
}

$root = getcwd();

require_once $root . '/wp-content/themes/cfe/vendor/Mustache/Autoloader.php';
Mustache_Autoloader::register();

$mustache = new Mustache_Engine(array(
   'loader' => new Mustache_Loader_FilesystemLoader($root . '/wp-content/themes/cfe/templates/mustache')
));

$root_category = get_category( 2 );

$args = array(
  'type'                     => 'post',
  'child_of'                 => 0,
  'parent'                   => 2,
  'orderby'                  => 'menu_order',
  'order'                    => 'ASC',
  'hide_empty'               => 0,
  'hierarchical'             => 1,
  'exclude'                  => '',
  'include'                  => '',
  'number'                   => '',
  'taxonomy'                 => 'category',
  'pad_counts'               => false 

); 

$categories = array();
$categories_temp = get_categories( $args );


foreach($categories_temp as $key => $category) {

  if($category->term_id != 8) {
    $categories[] = $category;
  }
  
}

$args = array(
  'type'                     => 'post',
  'child_of'                 => 0,
  'parent'                   => '',
  'orderby'                  => 'menu_order',
  'order'                    => 'ASC',
  'hide_empty'               => 0,
  'hierarchical'             => 1,
  'exclude'                  => '1,28,31,22,27,25,24,33',
  'include'                  => '',
  'number'                   => '',
  'taxonomy'                 => 'category',
  'pad_counts'               => false 

); 

// Get Involved term
$button = false;

$all = get_categories( $args );

$sorted = array();

// Loop through all categories and build array
foreach($all as $k => $item) {

  if($item->parent) {

    if($item->name == 'Get Involved' || $item->term_id == 11) {
      $button = $item;
      unset($all[$k]);
    } else {
      $sorted[$item->parent]['items'][] = $item;
    }

    
  } else {

    // Root cats

    $sorted[$item->term_id]['group'] = $item;

    
  }
}

asort($sorted);

$api = new X_API();

if(is_single() && $post) {
  $articles = $api->get_articles($post->ID);
} else {
  $articles = $api->get_articles();
}

?>

<script>
<?php if($base) { ?>
var base = '<?php echo $base; ?>';
<?php } else { ?>
var base = false;
<?php } ?>

<?php if($queried_tags) { ?>
var queried_tags = '<?php echo $queried_tags; ?>';
<?php } else { ?>
var queried_tags = false;
<?php } ?>
</script>

<?php if(is_home()) { ?>
<a class="brand" href="/">
  <img src="/wp-content/themes/cfe/assets/images/m-logo.png" />

  <div class="text"><span>Center for Entrepreneurship</span><span>College of Engineering</span></div>
</a>

<header class="banner" role="banner">
  <div class="container-fluid">

    <div class="landing">
      <div class="start-container">

        <ul>
          <li>
            <a href="#">
              <span>Start Me Up.</span>
              <img class="landing-arrow animated bounce animate-arrow" src="/wp-content/uploads/2015/08/arrow_new.png" />
            </a>
            <ul class="height-transition height-transition-hidden">
              <?php foreach($categories as $item) { ?>
              <li class="main-<?php echo $item->slug ?>" data-parent-slug="<?php echo $root_category->slug ?>" data-slug="<?php echo $item->slug ?>"><a href="#"><?php echo $item->name ?></a></li>
              <?php } ?>
            </ul>
          </li>
        </ul>


      </div>
    </div>

    <nav role="navigation">
      <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
      endif;
      ?>
    </nav>
  </div>
</header>
<?php } ?>

<header class="main-content <?php if(!is_home()) { echo 'content-expanded show-cfe'; } ?>">

  <div class="social-container">

    <a class="button call-out" href="/2015/08/27/get-involved-with-cfe/"><?php echo $button->name ?></a>

    <div class="social">
      <a target="_blank" href="https://www.facebook.com/cfe.UofM"><i class="fa fa-facebook"></i></a>
      <a target="_blank" href="https://twitter.com/UMCFE"><i class="fa fa-twitter"></i></a>
      <a target="_blank" href="https://www.youtube.com/user/UMCFE"><i class="fa fa-youtube"></i></a>
      <a target="_blank" href="https://instagram.com/umcfe/"><i class="fa fa-instagram"></i></a>
    </div>

    <form class="search-form" method="get" action="<?php echo get_site_url(); ?>">
      <div class="input-prepend search">
        <span class="add-on"><i class="fa fa-search fa-rotate-90"></i></span>
        <input id="s" name="s" placeholder="" value>
      </div>
    </form>
  </div>

  <div class="container-fluid">

    <div class="bubbles bubble-left">
      Welcome! Select the tags you wish to filter by from the 3 dropdowns. 
      The content will filter accordingly at the right.
    </div>

    <div class="bubbles bubble-right">
      Scroll up and down to see new content, or click the arrows to navigate horizontally.
    </div>

    <div class="row">
      <div class="top">

        <a class="brand" href="/">
          <img src="/wp-content/themes/cfe/assets/images/m-logo.png" />

          <div class="text"><span>Center for Entrepreneurship</span><span>College of Engineering</span></div>
        </a>

        <div class="address">
          <h6>
            <span><a href="tel:734-763-1021">734-763-1021</a> · CENTERFORENTREPRENEURSHIP@UMICH.EDU</span>
          </h6>
        </div>

      </div>
    </div>

    <div class="sidebar">

      <section class="sidebar-inner">

      <a class="back" href="#"><img src="/wp-content/uploads/2015/07/arrow-blue.png" />Back</a>
      
      <div class="faux-tiers-container">
        <button type="button">
          Filters
        </button>

        <div class="filters-list"></div>
      </div>

      <div id="tier-group" class="tiers-container">
        <?php foreach($sorted as $item) { ?>
        <button type="button" data-toggle="collapse" data-parent="#tier-group" data-target="#<?php echo $item['group']->slug ?>" aria-expanded="false" aria-controls="<?php echo $item['group']->slug ?>">
          <?php echo $item['group']->name ?>
          <i class="fa fa-minus"></i>
        </button>

        <?php if(isset($item['items'])) { ?>
        <div class="collapse" id="<?php echo $item['group']->slug ?>">
          <div class="well">
          <?php foreach($item['items'] as $label) { ?>
            <div class="checkbox-custom">
              <input id="<?php echo $item['group']->slug ?>-<?php echo $label->slug ?>" name="<?php echo $item['group']->slug ?>-<?php echo $label->slug ?>" data-group="<?php echo $item['group']->slug ?>" data-term-name="<?php echo $label->name ?>" data-term-id="<?php echo $label->term_id ?>" class="checkbox-input <?php echo $item['group']->slug ?> <?php echo $label->slug ?>" type="checkbox" value="">
              <label for="<?php echo $item['group']->slug ?>-<?php echo $label->slug ?>" class="checkbox-custom-label"><span><?php echo $label->name ?></span></label>
            </div>
          <?php } ?>
          </div>
        </div>
        <?php } ?>

        <div class="tier-specific-list large <?php echo $item['group']->slug ?>-list"></div>


      <?php } ?>
      </div>

      <div class="tier-submit">
        <button class="call-out-blue">Submit</button>
      </div>

      <div class="sidebar-bottom">


        <a class="button call-out newsletter" target="_blank" href="http://eepurl.com/bpVmtH"><i class="fa fa-envelope-o"></i> Student Newsletter</a>
        <a class="button call-out newsletter" target="_blank" href="http://eepurl.com/1Bwij"><i class="fa fa-envelope-o"></i> General Newsletter</a>

        <a class="button call-out" href="/2015/08/27/get-involved-with-cfe/"><?php echo $button->name ?></a>

        <div class="address">
          <h6>
            <span><a href="tel:734-763-1021">734-763-1021</a></span>
            <span>CENTERFORENTREPRENEURSHIP@UMICH.EDU</span>
          </h6>
        </div>
      </div>

      </section>
    </div>

    <div class="inner <?php echo $view ?>">

      <div class="message" data-search="No results found - try another search?" data-error="Oops! What you're looking for isn't here. Try filtering using the tags at the left to find what you need." data-results="Oops! Looks like we don’t have anything that matches all of those criteria. Try widening your search by deselecting a tag or two.">
        <p></p>
      </div>

      <div data-target="feed" class="feed-ctl controls">
        <a href="#" class="content-forward"><img src="/wp-content/uploads/2015/09/arrow-content-navigation-right.png" /></a>
        <a href="#" class="content-back"><img src="/wp-content/uploads/2015/07/arrow-content-navigation.png" /></a>
      </div>

      <div data-target="related" class="related-ctl controls">
        <a href="#" class="content-forward"><img src="/wp-content/uploads/2015/09/arrow-content-navigation-right.png" /></a>
        <a href="#" class="content-back"><img src="/wp-content/uploads/2015/07/arrow-content-navigation.png" /></a>
      </div>

      <div class="static">

        <div class="content">

          <a class="back" href="#">
            <span>
              <img src="/wp-content/uploads/2015/07/arrow-blue.png" />Back
            </span>
          </a>

          <?php if(is_single() && isset($articles['articles'])) { ?>
            <?php foreach($articles['articles'] as $article) {

              $tpl = $mustache->loadTemplate('post');

              echo $tpl->render((array)$article);
            }
            ?>
          <?php } ?>
        </div>
      </div>

      <div data-controls="feed-ctl" class="feed featured">

        <div class="swiper-featured">
          <div class="content swiper-wrapper">
          </div>
        </div>



      </div>

      <div class="related-wrapper">
        <div data-controls="related-ctl" class="related">
          <div class="swiper-related">
            <div class="content swiper-wrapper">
            </div>
          </div>
        </div>
      </div>

      <div style="clear:both"></div>
    </div>



  </div>
</header>

<script id="template-featured" type="x-tmpl-mustache">
<?php
echo file_get_contents($root . '/wp-content/themes/cfe/templates/mustache/list.mustache');
?>
</script>

<script id="template-post" type="x-tmpl-mustache">
<?php
echo file_get_contents($root . '/wp-content/themes/cfe/templates/mustache/post.mustache');
?>
</script>

<script id="template-search" type="x-tmpl-mustache">
<?php
echo file_get_contents($root . '/wp-content/themes/cfe/templates/mustache/search.mustache');
?>
</script>

<script id="template-related" type="x-tmpl-mustache">
<?php
echo file_get_contents($root . '/wp-content/themes/cfe/templates/mustache/related.mustache');
?>
</script>