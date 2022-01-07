var breeds;

$('#breed_search').on('input', function(e) {
  var search_str = $(this).val();
  searchBreeds(search_str);
});

function searchBreeds(search_str) {
  var string_length = search_str.length // 文字列の長さ
  search_str = search_str.toLowerCase(); 
  for (var i = 0; i < breeds.length; i++) 
  {
    var breed_name_snippet = breeds[i].name.substr(0, string_length).toLowerCase(); 
    if (breed_name_snippet == search_str) {
      getDogByBreed(breeds[i].id) // 一致したら表示
      return; // 関数の実行を停止
    }
  }
}

var $breed_select = $('select.breed_select');
$breed_select.change(function() {
  var id = $(this).children(":selected").attr("id");
  getDogByBreed(id)
});


// apiデータを取得
function getBreeds() {
  data_get('https://api.thedogapi.com/v1/breeds', function(data) {
    populateBreedsSelect(data)
    breeds = data
  });
}

function populateBreedsSelect(breeds) {
  $breed_select.empty().append(function() {
    var output = '';
    $.each(breeds, function(key, value) {
      output += '<option id="' + value.id + '">' + value.name + '</option>';
    });
    return output;
  });
}

function getDogByBreed(breed_id) {
  data_get('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breed_id, function(data) {

    if (data.length == 0) {
      clearBreed();
      $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed yet</td></tr>");
    } else {
      displayBreed(data[0])
    }
  });
}
// テーブルデータの削除
function clearBreed() {
  $('#breed_image').attr('src', "");
  $("#breed_data_table tr").remove();
}
// 画像とテーブルデータの表示
function displayBreed(image) {
  $('#breed_image').attr('src', image.url);
  $("#breed_data_table tr").remove();

  var breed_data = image.breeds[0]
  $.each(breed_data, function(key, value) {
    // 配列データを参照
    if (key == 'weight' || key == 'height') value = value.metric
    // テーブルに入力
    $("#breed_data_table").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>");
  });
}

function data_get(url, callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
      console.log('responseText:' + xmlhttp.responseText);
      try {
        var data = JSON.parse(xmlhttp.responseText);
      } catch (err) {
        console.log(err.message + " in " + xmlhttp.responseText);
        return;
      }
      callback(data);
    }
  };

  xmlhttp.open("GET", url, true);
  xmlhttp.send();
}

getBreeds();
