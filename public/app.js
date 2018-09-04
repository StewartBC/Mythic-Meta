let dungeon = "";
let dungeonString = "";

$(document).on("click", "#another", function(event) {
  location.reload();
});

$.ajax({
  type: "GET",
  url: "https://raider.io/api/v1/mythic-plus/affixes?region=us&locale=en"
}).then(function(result) {
  result.affix_details.forEach(affix => {
    $("#affixes").append(`
    <img data-toggle="tooltip" data-placement="top" title="${affix.description}" class="affixImage" src="images/${affix.name}.jpg">
  `);
  });
   $('[data-toggle="tooltip"]').tooltip({'placement': 'top'});
});
$(".imgContainer").click(function () {
  $(".imgContainer").removeClass("activeImage");
  $(".overlay").removeClass("activeOverlay");
  dungeon = $(this).attr("data-dungeon");
  dungeonString = $(this).children(".overlay").children(".text").text();
  $(this).addClass("activeImage");
  $(this).children(".overlay").addClass("activeOverlay");
  $(".imgText").addClass("hide");
  $(this).children(".imgText").removeClass("hide");
});
$("#submit").click(function (event) {
  event.preventDefault();
  $("#results").addClass("hide");
  $("#submit").addClass("hide");
  $("#tanksRowOne").empty();
  $("#tanksRowTwo").empty();
  $("#healersRowOne").empty();
  $("#healersRowTwo").empty();
  $("#dpsRowOne").empty();
  $("#dpsRowTwo").empty();
  $("#dpsRowThree").empty();
  $(".images").addClass("gone");
  $("#loading").removeClass("gone");
  $("#loading").html(`
  <div class="row">
  <div class="col-md-2">
  </div>
    <div class="col-md-8">
      <img class="loadingImage" src="images/loading.svg">
    </div>
    <div class="col-md-2">
    </div>
    </div>
  `);
  $.ajax({
    type: "GET",
    url: `/scrapes/${dungeon}`
  }).then(function (result) {
    $("#hideMe").addClass("gone");
    $(".card").removeClass("gone");
    $("#submit").removeClass("hide");
    $("#tanksRowOne").empty();
    $("#healersRowOne").empty();
    $("#dpsRowOne").empty();
    $("#results").removeClass("hide");
    $("#loading").addClass("gone");
    $(".tankHeader").text(`Top Tanks for ${dungeonString}`);
    $(".healerHeader").text(`Top Healers for ${dungeonString}`);
    $(".dpsHeader").text(`Top DPS for ${dungeonString}`);
    $(".startHeader").html(`
      <button id="another" type="submit" class="btn btn-primary">Select Another Dungeon</button>
    `)
    var tankSort = [];
    var healerSort = [];
    var dpsSort = [];
    for (var tank in result.tanks) {
      tankSort.push([tank, result.tanks[tank]]);
    }
    tankSort.sort(function (a, b) {
      return b[1].average - a[1].average;
    });
    for (var healer in result.healers) {
      healerSort.push([healer, result.healers[healer]]);
    }
    healerSort.sort(function (a, b) {
      return b[1].average - a[1].average;
    });
    for (var damager in result.dps) {
      dpsSort.push([damager, result.dps[damager]]);
    }
    dpsSort.sort(function (a, b) {
      return b[1].average - a[1].average;
    });
    tankSort.forEach(function (tank, index) {
      if (index < 4) {
        $("#tanksRowOne").append(`
        <div class="col-md-3">
          <div class="centerThis">
           <span>${index + 1}.</span>
           <img class ="classImage" src="images/${tank[0]}.svg">
          </div>
        </div>
      `);
      } else {
        $("#tanksRowTwo").append(`
        <div class="col-md-3">
          <div class="centerThis">
            <span>${index + 1}.</span>
            <img class ="classImage" src="images/${tank[0]}.svg">
          </div>
        </div>
    `);
      }
    });
    healerSort.forEach(function (healer, index) {
      if (index < 4) {
        $("#healersRowOne").append(`
        <div class="col-md-3">
          <div class="centerThis">
            <span>${index + 1}.</span>
            <img class ="classImage" src="images/${healer[0]}.svg">
          </div>
        </div>
      `);
      } else {
        $("#healersRowTwo").append(`
        <div class="col-md-3">
          <div class="centerThis">
            <span>${index + 1}.</span>
            <img class ="classImage" src="images/${healer[0]}.svg">
          </div>
        </div>
    `);
      }
    });
    dpsSort.forEach(function (dps, index) {
      if (index < 4) {
        $("#dpsRowOne").append(`
        <div class="col-md-3">
          <div class="centerThis">
            <span>${index + 1}.</span>
            <img class ="classImage" src="images/${dps[0]}.svg">
          </div>
        </div>
      `);
      } else if (index < 8) {
        $("#dpsRowTwo").append(`
        <div class="col-md-3">
          <div class="centerThis">
            <span>${index + 1}.</span>
            <img class ="classImage" src="images/${dps[0]}.svg">
          </div>
        </div>
    `);
      } else {
        $("#dpsRowThree").append(`
        <div class="col-md-3">
          <div class="centerThis">
            <span>${index + 1}.</span>
            <img class ="classImage" src="images/${dps[0]}.svg">
          </div>
        </div>
    `);
      }
    });
  });
});