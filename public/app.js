let dungeon = "";
$(".imgContainer").click(function (event) {
  $(".imgContainer").removeClass("activeImage");
  $(".overlay").removeClass("activeOverlay");
  event.preventDefault();
  dungeon = $(this).attr("data-dungeon");
  $(this).addClass("activeImage");
  $(this).children(".overlay").addClass("activeOverlay");
});
$("#submit").click(function (event) {
  $("#results").addClass("hide");
  $("#submit").addClass("hide");
  $("#tanksRowOne").empty();
  $("#tanksRowTwo").empty();
  $("#healersRowOne").empty();
  $("#healersRowTwo").empty();
  $("#dpsRowOne").empty();
  $("#dpsRowTwo").empty();
  $("#dpsRowThree").empty();
  event.preventDefault();
  $("#loading").removeClass("gone");
  $("#loading").html(`
  <div class="row">
  <div class="col-md-2">
  </div>
    <div class="col-md-8">
      <img class="loadingImage" src="images/loading.gif">
    </div>
    <div class="col-md-2">
    </div>
    </div>
  `);
  $.ajax({
    type: "GET",
    url: `/scrapes/${dungeon}`
  }).then(function (result) {
    $("#submit").removeClass("hide");
    $("#tanksRowOne").empty();
    $("#healersRowOne").empty();
    $("#dpsRowOne").empty();
    $("#results").removeClass("hide");
    $("#loading").addClass("gone");
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