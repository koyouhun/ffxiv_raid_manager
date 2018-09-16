const select_type_to_kor = {
  'crafted': '제작',
  'normal': '일반',
  'slate': '석판',
  'augmented': '석판보강',
  'savage': '영식',
};
const item_code = {
  0: 'not_selected',
  1: 'normal',
  2: 'crafted',
  3: 'slate',
  4: 'augmented',
  5: 'savage'
}

var unique_id = getQueryParam('unique_id') || readCookie('unique_id');
var FIX = {
  'fix_left': [],
  'fix_right': [],
  'fix_weapon': []
}
var JOB = {
  'PLD': {'bis': {}, 'current': {}},
  'WAR': {'bis': {}, 'current': {}},
  'DRK': {'bis': {}, 'current': {}},

  'WHM': {'bis': {}, 'current': {}},
  'SCH': {'bis': {}, 'current': {}},
  'AST': {'bis': {}, 'current': {}},

  'BRD': {'bis': {}, 'current': {}},
  'MCH': {'bis': {}, 'current': {}},

  'MNK': {'bis': {}, 'current': {}},
  'NIN': {'bis': {}, 'current': {}},
  'DRG': {'bis': {}, 'current': {}},
  'SAM': {'bis': {}, 'current': {}},

  'BLM': {'bis': {}, 'current': {}},
  'SMN': {'bis': {}, 'current': {}},
  'RDM': {'bis': {}, 'current': {}}
}

function save_fix(new_job, fix_type) {
  $.ajax({
    method: 'POST',
    url: 'api/save/fix',
    contentType : 'application/json',
    data: JSON.stringify({
      'unique_id': unique_id,
      'fix_type': fix_type,
      'job_list': FIX[fix_type]
    }),
    success: function(data) {
      var target = $(fix_type);
      target.html("");
      $.each(FIX[fix_type], function(job) {
        target.append('<img class="fix_job" src="icons/' + job + '.png">');
      });
    }
  });
}

function save_job(job, data_type) {
  var job = elem.parent().parent().parent().attr('id');
  $.ajax({
    method: 'POST',
    url: 'api/save/job',
    contentType : 'application/json',
    data: JSON.stringify({
      'unique_id': unique_id,
      'job': job,
      'data_type': data_type,
      'item_status': JOB[job]
    })
  });
}

function show_fix() {
  $.each(FIX, function(fix_type, job_list) {
    var target = $(fix_type);
    target.html("");
    $.each(job_list, function(job) {
      target.append('<img class="fix_job" src="icons/' + job + '.png">');
    });
  });
}

function show_job(job, data_type) {
  var target = $("#" + job).find("." + data_type);
  $.each(JOB[job][data_type], function(data) {
    $.each(data, function(part, item_type) {
      target.find("." + part)
            .removeClass('not_selected crafted slate augmented savage')
            .addClass(item_code[item_type]);
    });
  });
}

function load_team(uid) {
  unique_id = uid;
  $(".fix_item_box").hide();
  $(".job_box").hide();
  $(".loading").show();
  $("#unique_id").text(uid);
  $("#team_name").text("로딩중...");
  $.ajax({
    method: 'GET',
    url: 'api/load?uid=' + uid,
    success: function(data) {
      if (data['success'] === false) {
        $("#find_team").click();
        $("#team_name").text("존재하지 않는 공대 번호입니다.");
        $("#find_error").show();
      }
      else {
        $("#find_error").hide();
        $("#team_name").text(data['team_name']);
        $.each(data['fix_list'], function(fix) {
          var elem = $("#"+fix['name']);
          elem.html("");
          $.each(fix['list'], function(job) {
            elem.append('<img class="fix_item_img" src="../icons/' + job + '.png">');
          });
        });
        $.each(data['job_list'], function(job) {
          $.each(job['bis'], function(bis) {
            var part = $("#"+job['name']).find("."+bis['part']);
            part.removeClass('crafted slate augmented savage').addClass(bis['item_class']);
            part.text(select_type_to_kor[bis['item_class']]);
          });
          $.each(job['current'], function(current) {
            var part = $("#"+job['name']).find("."+current['part']);
            part.removeClass('crafted slate augmented savage').addClass(current['item_class']);
            part.text(select_type_to_kor[current['item_class']]);
          });
        });
        setTimeout(function() {
          $.each(data['job_list'], function(job) {
            $("#"+job['name']).show();
          });
        }, 0);
      }
    }
  });
}

function item_status_to_dict(item_status) {
  return {
    'exist': item_status % 2,
    'weapon': (item_status = item_status >>> 1) % 2,
    'sub_weapon': (item_status = item_status >>> 3) % 2,
    'head': (item_status = item_status >>> 3) % 2,
    'body': (item_status = item_status >>> 3) % 2,
    'hands': (item_status = item_status >>> 3) % 2,
    'waist': (item_status = item_status >>> 3) % 2,
    'legs': (item_status = item_status >>> 3) % 2,
    'feet': (item_status = item_status >>> 3) % 2,
    'earrings': (item_status = item_status >>> 3) % 2,
    'necklace': (item_status = item_status >>> 3) % 2,
    'bracelet': (item_status = item_status >>> 3) % 2,
    'ring_left': (item_status = item_status >>> 3) % 2,
    'ring_right': (item_status = item_status >>> 3) % 2
  }
}

function dict_to_item_status(dict) {
  var a = 1;
  return dict['exist'] +
  (dict['weapon'] << a) +
  (dict['sub_weapon'] << (a = a+3)) +
  (dict['head'] << (a = a+3)) +
  (dict['body'] << (a = a+3)) +
  (dict['hands'] << (a = a+3)) +
  (dict['waist'] << (a = a+3)) +
  (dict['legs'] << (a = a+3)) +
  (dict['feet'] << (a = a+3)) +
  (dict['earrings'] << (a = a+3)) +
  (dict['necklace'] << (a = a+3)) +
  (dict['bracelet'] << (a = a+3)) +
  (dict['ring_left'] << (a = a+3)) +
  (dict['ring_right'] << (a+3))
}

function getQueryParam(name) {
  if (window.location.href.indexOf('?') === -1) {
    return undefined;
  }
  var vars = {}, hash;
  var hashes = window.location.href.slice(window.location.href.indexOf('?') +1).split('&');
  for(var i=0; i< hashes.length; i++) {
    hash = hashes[i].split('=');
    vars[hash[0]] = hash[1];
  }
  return vars[name];
}

function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');
  for (var i = 0; i < ca.length; i++) {
  var c = ca[i];
  while (c.charAt(0) == ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return undefined;
}

function setCookie(name, value, days) {
  var text = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  if (days !== undefined) {
    var date = new Date();
    date.setTime(date.getTime() + (days*24*60*60*1000));
    text += (";expires=" + date.toUTCString());
  }
  text += (";domain=wishket.com");
  text += ";path=/";
  document.cookie = text;
}

$(document).on('ready', function() {
  $(".menu").on('click', function() {
    $(".menu").removeClass('active');
    $(this).addClass('active');
    $(".tab").hide();
    $("."+$(this).attr('id')).show();
  });
  if (unique_id === undefined) {
    $("#find_team").click();
  } else {
    $("#overview").click();
    load_data(unique_id);
  }
});