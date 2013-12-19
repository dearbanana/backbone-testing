// Reformat documentation and add in extra Bootstrap goodness.
$(function () {
  'use strict';

  var Transforms,
    // http://www.pinlady.net/PluginDetect/IE/
    IS_IE = /*@cc_on!@*/!1,
    // See: http://tanalin.com/en/articles/ie-version-js/
    IE_GTE_10 = !!window.atob;

  // Helpers.
  function slugify(val) {
    return val
      .toLowerCase()
      .replace(/[^\-a-zA-Z0-9\s]+/gi, '')
      .replace(/\-/gi, "_")
      .replace(/\s/gi, "-");
  }

  Transforms = {
    headingToHero: function () {
      // Get and detach header elements.
      var $h1 = $("h1").first(),
        $parent = $h1.parent(),
        $p = $h1.next("p").detach();

      // Replace with hero.
      $("#hero")
        .detach()
        .append($h1.detach(), $p)
        .prependTo($parent);
    },

    navAffix: function () {
      // http://stackoverflow.com/a/13151016/741892
      var $hero = $("#hero"),
        $nav = $("#nav"),
        top = $nav.offset().top,
        resize = function () {
          $nav.width($hero.width());
        };

      $nav.affix({
        offset: {
          top: function () {
            resize();
            return top;
          }
        }
      });

      // Always resize to hero width.
      $(window).resize(resize);

      // Position better.
      $("#nav-wrapper").height($("#nav").height());
    },

    heading: function () {
      var $heading = $("h1").first(),
        text = $heading.text();

      // Wrap in a link around the heading.
      $heading
        .empty()
        .append($("<a href='./index.html' />").text(text));
    },

    images: function () {
      var pictureClass = [
          "Notes List",
          "Edit Note",
          "View Note"
        ],
        bookClass = [
          "Book Cover"
        ];

      // Add special picture classes to known titles.
      $("img").each(function () {
        if (_.indexOf(pictureClass, $(this).prop("title")) !== -1) {
          $(this).addClass("picture");
        }
        if (_.indexOf(bookClass, $(this).prop("title")) !== -1) {
          $(this).addClass("book");
        }
      });
    },

    navSections: function () {
      var $window = $(window),
        $hero = $("#hero"),
        $content = $hero.nextAll(),
        $headings = $content.filter("h2"),
        $nav = $content.find("#nav-sections");

      // Add headings to nav.
      $headings.each(function () {
        var $heading = $(this),
          $item = $("#fixtures .nav-item").clone(),
          slug = slugify($heading.text());

        // Add id to heading.
        $heading.attr("id", slug);

        // Append list item with attributes.
        $item
          .appendTo($nav)
          .find("> a")
            .attr("href", "#" + slug)
            .append($heading.text());
      });

      // Nav bar scrollspy.
      $("body").scrollspy({ target: "#nav" });
      $nav.find("li.nav-item").on("click", function () {
        $(this).scrollspy("refresh");
      });

      // Nav bar scroll animation.
      $("li.nav-item > a").click(function () {
        $("html, body").animate({
          scrollTop: $($(this).attr("href")).offset().top + "px"
        }, {
          duration: 400,
          easing: "swing"
        });
        return false;
      });
    },

    chapterExamples: function () {
      var $chapExs = $("h3:contains('Chapter')")
        .filter(function (i, el) {
          return (/^Chapter [1-6]:/).test($(el).text());
        });

      $chapExs.each(function () {
        var $list = $(this).next("ul").first(),
          $files = $list.find("li ul li a").filter(function () {
            return (/\.js$/).test($(this).text());
          });

        $files.addClass("examples-file");
      });
    }
  };

  // Apply transforms.
  _.each([
    "headingToHero",
    "navAffix",
    "heading",
    "images",
    "navSections",
    "chapterExamples"
  ], function (fn) { Transforms[fn](); });

});
