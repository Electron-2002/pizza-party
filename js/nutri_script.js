$(document).ready(function(){

  $(this).scrollTop(0);
  
  $(window).scroll(function(){
      if(this.scrollY > 20){
          $('.navbar').addClass("sticky");
      }
      else{
          $('.navbar').removeClass("sticky");
      }
  });

  $('.menu-button').click(function(){
      $('.menu').toggleClass('active');
      $('.menu-button i').toggleClass('active');
  });
});

$("#search-submit").click(function () {
  var table = $("#result-table");
  // var rowNum = parseInt($("#table-row-num").val(), 10);
  var resultHtml = "";
  search_param = document.getElementById("search-input").value;

  search_param = search_param.replace(" ", "%20");
  console.log(search_param);

  if (search_param == "") {
    console.log("empty");
    resultHtml = [
      "<tr>",
      '<td class="display-row"><div class="display-div" type="name">' +
        "Please enter something" +
        "</div></td>",
      '<td><button class="select-button" id="submitButton">' +
        '<i class="fa fa-plus-square-o" aria-hidden="true"></i></button></td>',
      "</tr>",
    ].join("\n");
    table.html(resultHtml);
  }

  // api url
  const api_url =
    "https://api.edamam.com/api/food-database/v2/parser?ingr=" +
    search_param +
    "&app_id=7a57ac2c&app_key=6006f4e7fb32356af72d61774d7e2445";
  console.log(api_url);

  // Defining async function
  async function getapi(url) {
    // Storing response
    const response = await fetch(url);

    // Storing data in form of JSON
    var data = await response.json();

    return data;
  }

  // Calling that async function
  data = getapi(api_url);

  data.then(function (fetched_data) {
    var rowNum = Object.keys(fetched_data.hints).length;

    if (rowNum != 0) {
      for (var i = 0; i < rowNum; i++) {
        //edit for fetching data from api
        var uni_id = 'id = "input-one-' + (i + 1) + '"';
        var uni_get = "input-one-" + (i + 1);
        var food_name = fetched_data.hints[i]["food"]["label"];
        var energy = parseFloat(
          fetched_data.hints[i]["food"]["nutrients"]["ENERC_KCAL"].toFixed(2)
        );
        var protein = parseFloat(
          fetched_data.hints[i]["food"]["nutrients"]["PROCNT"].toFixed(2)
        );
        var fat = parseFloat(
          fetched_data.hints[i]["food"]["nutrients"]["FAT"].toFixed(2)
        );
        var carbs = parseFloat(
          fetched_data.hints[i]["food"]["nutrients"]["CHOCDF"].toFixed(2)
        );
        console.log(food_name, energy, protein, fat, carbs);

        var btn_fn =
          'onclick = "display(document.getElementById(' +
          "'" +
          uni_get +
          "'" +
          ").innerHTML," +
          energy +
          "," +
          protein +
          "," +
          fat +
          "," +
          carbs +
          ')"';
        console.log(btn_fn);
        //section over

        resultHtml += [
          "<tr class='display-row-parent'>",
          '<td class="display-row"><div class="display-div" type="name"' +
            uni_id +
            ">" +
            food_name +
            "</div></td>",
          '<td><button class="select-button" id="submitButton"' +
            btn_fn +
            '><i class="fa fa-plus-square-o" aria-hidden="true"></i></button></td>',
          "</tr>",
        ].join("\n");
        table.html(resultHtml);
      }
    } else {
      console.log("no results");
      resultHtml = [
        "<tr>",
        '<td class="display-row"><div class="display-div" type="name">' +
          "No results" +
          "</div></td>",
        '<td><button class="select-button" id="submitButton">' +
          '<i class="fa fa-plus-square-o" aria-hidden="true"></i></button></td>',
        "</tr>",
      ].join("\n");
      table.html(resultHtml);
    }

    return false;
  });
});

function display(ans, energy, protein, fat, carbs) {
  console.log(ans);
  document.documentElement.style.setProperty("--fetch-text", ans);
  document.getElementById("selected").innerHTML = ans;

  document.getElementById("selected-energy").innerHTML =
    "energy: " + energy + " kcal";
  document.getElementById("selected-energy").setAttribute("value", energy);

  document.getElementById("selected-protein").innerHTML =
    "protein: " + protein + " g";
  document.getElementById("selected-protein").setAttribute("value", protein);

  document.getElementById("selected-fat").innerHTML = "fat: " + fat + " g";
  document.getElementById("selected-fat").setAttribute("value", fat);

  document.getElementById("selected-carbs").innerHTML =
    "carbs: " + carbs + " g";
  document.getElementById("selected-carbs").setAttribute("value", carbs);

  document.getElementById("master").style.setProperty("filter", "blur(10px)");
  document.getElementById("footer-parent").style.setProperty("filter", "blur(10px)");
  document.getElementById("popup").style.setProperty("display", "block");
}

function close_popup() {
  document.getElementById("master").style.setProperty("filter", "blur(0px)");
  document.getElementById("footer-parent").style.setProperty("filter", "blur(0px)");
  document.getElementById("popup").style.setProperty("display", "none");
  document.getElementById("slider").value = 100;
  document.getElementById("slider-value").innerHTML = 100 + "g";
}

function progress_slide(energy, protein, fat, carbs) {
  const cal_goal = 2250;
  const carb_goal = 300;
  const pro_goal = 60;
  const fat_goal = 60;

  console.log(energy, protein, fat, carbs);

  initial_carb = document.getElementById("carb-circle").getAttribute("data-value")
  carb_add_per = (carbs/carb_goal)*100 + parseFloat(initial_carb)
  carb_add_val = parseFloat(carb_add_per)*parseFloat(carb_goal)/100

  if (carb_add_per > 100){
    document.getElementById("carb-limit").innerHTML = "Daily Limit Exceeded"
  }
  else{
    document.getElementById("carb-limit").innerHTML = "Daily Limit: " + carb_goal + ' g'
  }

  document.getElementById("carb-circle").setAttribute("data-value", carb_add_per)
  document.getElementById("carb-progress-percentage").innerHTML = carb_add_per.toFixed(1)
  document.getElementById("carb-true-value").innerHTML = carb_add_val.toFixed(2) + ' g'


  initial_fat = document.getElementById("fat-circle").getAttribute("data-value")
  fat_add_per = (fat/fat_goal)*100 + parseFloat(initial_fat)
  fat_add_val = parseFloat(fat_add_per)*parseFloat(fat_goal)/100

  if (fat_add_per > 100){
    document.getElementById("fat-limit").innerHTML = "Daily Limit Exceeded"
  }
  else{
    document.getElementById("fat-limit").innerHTML = "Daily Limit: " + fat_goal + ' g'
  }

  document.getElementById("fat-circle").setAttribute("data-value", fat_add_per)
  document.getElementById("fat-progress-percentage").innerHTML = fat_add_per.toFixed(1)
  document.getElementById("fat-true-value").innerHTML = fat_add_val.toFixed(2) + ' g'


  initial_pro = document.getElementById("pro-circle").getAttribute("data-value")
  pro_add_per = (protein/pro_goal)*100 + parseFloat(initial_pro)
  pro_add_val = parseFloat(pro_add_per)*parseFloat(pro_goal)/100

  if (pro_add_per > 100){
    document.getElementById("pro-limit").innerHTML = "Daily Limit Exceeded"
  }
  else{
    document.getElementById("pro-limit").innerHTML = "Daily Limit: " + pro_goal + ' g'
  }

  document.getElementById("pro-circle").setAttribute("data-value", pro_add_per)
  document.getElementById("pro-progress-percentage").innerHTML = pro_add_per.toFixed(1)
  document.getElementById("pro-true-value").innerHTML = pro_add_val.toFixed(2) + ' g'



  initial_cal = document.getElementById("cal-circle").getAttribute("data-value")
  cal_add_per = (energy/cal_goal)*100 + parseFloat(initial_cal)
  cal_add_val = parseFloat(cal_add_per)*parseFloat(cal_goal)/100

  if (cal_add_per > 100){
    document.getElementById("cal-limit").innerHTML = "Daily Limit Exceeded"
  }
  else{
    document.getElementById("cal-limit").innerHTML = "Daily Limit: " + cal_goal + ' kcal'
  }

  document.getElementById("cal-circle").setAttribute("data-value", cal_add_per)
  document.getElementById("cal-progress-percentage").innerHTML = cal_add_per.toFixed(1)
  document.getElementById("cal-true-value").innerHTML = cal_add_val.toFixed(0) + ' kcal'

  $(function () {
    $(".progress").each(function () {
      var value = $(this).attr("data-value"); //add the value to this
      var left = $(this).find(".progress-left .progress-bar");
      var right = $(this).find(".progress-right .progress-bar");
  
      if (value >= 0 && value <= 100) {
        if (value <= 50) {
          right.css("transform", "rotate(" + percentageToDegrees(value) + "deg)");
        } else {
          right.css("transform", "rotate(180deg)");
          left.css(
            "transform",
            "rotate(" + percentageToDegrees(value - 50) + "deg)"
          );
        }
      }
      else {
        console.log('hogya bhai')
        value = 100
        right.css("transform", "rotate(180deg)");
        left.css(
          "transform",
          "rotate(" + percentageToDegrees(value - 50) + "deg)");
      }
    });
  
    function percentageToDegrees(percentage) {
      return (percentage / 100) * 360;
    }
  });
}

function add_list() {
  val_sel = document.getElementById("slider").value;
  food_sel = document.getElementById("selected").innerHTML;

  var table = $("#list-table");
  var resultHtml = document.getElementById("list-table").innerHTML;
  resultHtml += [
    "<tr>",
    '<td class="list-display-row"><div class="list-display-div-1" type="name">' +
      food_sel +
      '</div><div class="list-display-div-2">' +
      val_sel +
      "g" +
      "</div></td>",
    "</tr>",
  ].join("\n");

  table.html(resultHtml);
  document.getElementById("master").style.setProperty("filter", "blur(0px)");
  document.getElementById("popup").style.setProperty("display", "none");

  val = document.getElementById("slider").value / 100;

  const energy =
    document.getElementById("selected-energy").getAttribute("value") * val;
  const protein =
    document.getElementById("selected-protein").getAttribute("value") * val;
  const fat =
    document.getElementById("selected-fat").getAttribute("value") * val;
  const carbs =
    document.getElementById("selected-carbs").getAttribute("value") * val;

  progress_slide(energy, protein, fat, carbs);

  document.getElementById("slider").value = 100;
  document.getElementById("slider-value").innerHTML = 100 + "g";
}

function slider_update(value) {
  document.getElementById("slider-value").innerHTML = value + "g";

  const energy = document
    .getElementById("selected-energy")
    .getAttribute("value");
  const energy_out = parseFloat(energy) / 100;
  document.getElementById("selected-energy").innerHTML =
    "energy: " + (energy_out * value).toFixed(0) + " kcal";

  const protein = document
    .getElementById("selected-protein")
    .getAttribute("value");
  const protein_out = parseFloat(protein) / 100;
  document.getElementById("selected-protein").innerHTML =
    "protein: " + (protein_out * value).toFixed(2) + " g";

  const fat = document.getElementById("selected-fat").getAttribute("value");
  const fat_out = parseFloat(fat) / 100;
  document.getElementById("selected-fat").innerHTML =
    "fat: " + (fat_out * value).toFixed(2) + " g";

  const carbs = document.getElementById("selected-carbs").getAttribute("value");
  const carbs_out = parseFloat(carbs) / 100;
  document.getElementById("selected-carbs").innerHTML =
    "carbs: " + (carbs_out * value).toFixed(2) + " g";

  console.log(energy_out, protein_out, fat_out, carbs_out);
}

$(function () {
  $(".progress").each(function () {
    var value = $(this).attr("data-value"); //add the value to this
    var left = $(this).find(".progress-left .progress-bar");
    var right = $(this).find(".progress-right .progress-bar");

    if (value > 0) {
      if (value <= 50) {
        right.css("transform", "rotate(" + percentageToDegrees(value) + "deg)");
      } else {
        right.css("transform", "rotate(180deg)");
        left.css(
          "transform",
          "rotate(" + percentageToDegrees(value - 50) + "deg)"
        );
      }
    }
  });

  function percentageToDegrees(percentage) {
    return (percentage / 100) * 360;
  }
});
