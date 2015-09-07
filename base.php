<?php

use Roots\Sage\Config;
use Roots\Sage\Wrapper;

?>

<!doctype html>
<html class="public no-js" <?php language_attributes(); ?>>
  <?php get_template_part('templates/head'); ?>
  <body <?php body_class(); ?>>
    <!--[if lt IE 9]>
      <div class="alert alert-warning">
        <?php _e('You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.', 'sage'); ?>
      </div>
    <![endif]-->
    <div class="cover"></div>
    <?php
      do_action('get_header');
      get_template_part('templates/header');
    ?>

    <?php
      do_action('get_footer');
      get_template_part('templates/footer');
      wp_footer();
    ?>

    <script>
      (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
      })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

      ga('create', 'UA-67204802-1', 'auto');
      ga('send', 'pageview');

    </script>

    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scrollbar/jquery.mCustomScrollbar.concat.min.js'></script>
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/slide.js'></script>
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/mustache.min.js'></script>

    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/isotope.pkgd.min.js'></script>
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/horizontal.js'></script>
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/jquery.cookie.js'></script>
    
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/linkify.min.js'></script>
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/linkify-jquery.min.js'></script>
    
    <script type='text/javascript' src='/wp-content/themes/cfe/assets/scripts/swiper.jquery.min.js'></script>
    
  </body>
</html>
