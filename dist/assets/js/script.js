"use strict";

$("#loginModal .nav-tabs button").on("click", function () {
  $("#loginModal .nav-tabs button").removeClass("active");
  $(this).addClass("active");
  var data_hef = $(this).attr("data-bs-target");
  $("#loginModal .tab-content .tab-pane").removeClass("active show");
  $(data_hef).addClass("active show");
});
$(".btn-ranger a").on("click", function () {
  var data_hef = $(this).attr("data-bs-target");
  $("#loginModal .nav-tabs button").removeClass("active");
  $("#loginModal .tab-content .tab-pane").removeClass("active show");
  $("#" + data_hef).addClass("active show");
  $(".btn-" + data_hef).addClass("active");
});
$(".list-box-tutorial").on("click", function () {
  $(".list-box-tutorial").removeClass("active");
  $(this).addClass("active");
});