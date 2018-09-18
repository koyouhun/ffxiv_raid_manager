const select_type_to_kor = {
  'not_selected': '',
  'crafted': '제작',
  'normal': '일반',
  'slate': '석판',
  'augmented': '보강',
  'savage': '영식',
};
const from_item_code = {
  0: 'not_selected',
  1: 'normal',
  2: 'crafted',
  3: 'slate',
  4: 'augmented',
  5: 'savage'
};
const to_item_code = {
  'not_selected': 0,
  'normal': 1,
  'crafted': 2,
  'slate': 3,
  'augmented': 4,
  'savage': 5
};

var unique_id = getQueryParam('unique_id') || readCookie('unique_id');
var FIX = {
  'fix_left': [],
  'fix_right': [],
  'fix_weapon': []
};
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
};

function make_team(name) {
  $.ajax({
    method: 'POST',
    url: 'api/make',
    contentType : 'application/json',
    data: JSON.stringify({
      'name': name
    }),
    success: function(data) {
      if (data['success']) {
        window.location.replace(window.location.origin+'?unique_id='+data['unique_id']);
      } else {
        alert("사용불가능한 공대 이름입니다!")
      }
    }
  });
}

function save_fix(fix_type) {
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
      if (data['success']) {
        show_fix();
      } else {
        alert(data['message'])
      }
    }
  });
}

function save_job(job, data_type) {
  $.ajax({
    method: 'POST',
    url: 'api/save/job',
    contentType : 'application/json',
    data: JSON.stringify({
      'unique_id': unique_id,
      'job': job,
      'data_type': data_type,
      'item_status': dict_to_item_status(JOB[job][data_type])
    }),
    success: function(data) {
      if (data['success']) {
        show_job(job, data_type);
        $(".item").removeClass('active');
      } else {
        alert(data['message'])
      }
    }
  });
}

function show_fix() {
  $.each(FIX, function(fix_type, job_list) {
    var target = $('#'+fix_type).find('.job_list');
    target.html("");
    $.each(job_list, function(_, job) {
      target.append('<img class="fix_job" src="static/icons/' + job + '.png">');
    });
  });
  setTimeout(function() {
    $(".fix_job").on('click', function() {
      if (confirm('삭제하시겠습니까?')) {
        var index = $(this).parent().children().index($(this));
        var fix_type = $(this).parents('.fix_item_box').attr('id');
        FIX[fix_type].splice(index, 1);
        save_fix(fix_type);
      }
    });
  }, 0);
}

function show_job(job_name, data_type) {
  var target = $("#" + job_name).find("." + data_type);
  $.each(JOB[job_name][data_type], function(part, item_type) {
    $("#"+job_name).show();
    if (part === 'exist' && item_type === 1) {
      $("#"+job_name).show();
    } else {
      target.find("." + part)
            .removeClass('not_selected crafted slate augmented savage')
            .addClass(from_item_code[item_type]);
      target.find("." + part)
            .find(".pre_item")
            .find('.item_img')
            .text(select_type_to_kor[from_item_code[item_type]]);
    }
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
    url: 'api/load?unique_id=' + uid,
    success: function(data) {
      $(".loading").hide();
      $(".fix_item_box").show();

      if (data['success'] === false) {
        $("#find_team").click();
        $("#team_name").text("존재하지 않는 공대 코드입니다.");
        $("#find_error").show();
        unique_id = undefined;
        alert("존재하지 않는 공대 코드입니다.")
      }
      else {
        $("#find_error").hide();
        $("#team_name").text(data['name']);

        $.each(FIX, function(fix_type) {
          FIX[fix_type] = data[fix_type];
        });
        $.each(JOB, function(job_name) {
          JOB[job_name]['bis'] = item_status_to_dict(data[job_name + '_BIS']);
          JOB[job_name]['current'] = item_status_to_dict(data[job_name + '_CURRENT']);
        });
        setTimeout(function() {
          $.each(JOB, function(job_name) {
            show_job(job_name, 'bis');
            show_job(job_name, 'current');
          });
          show_fix();
        }, 0);
      }
    }
  });
}

function item_status_to_dict(item_status) {
  return {
    'exist': item_status % 2, // 39 (overflow)
    'weapon': (item_status = Math.floor((item_status - (item_status % 2)) / 2)) % 8, // 39 (overflow)
    'sub_weapon': (item_status = Math.floor(item_status / 8)) % 8, // 36 (overflow)
    'head': (item_status = Math.floor(item_status / 8)) % 8, // 33 (overflow)
    'chest': (item_status = item_status >>> 3) % 8,
    'hands': (item_status = item_status >>> 3) % 8,
    'waist': (item_status = item_status >>> 3) % 8,
    'legs': (item_status = item_status >>> 3) % 8,
    'feet': (item_status = item_status >>> 3) % 8,
    'ears': (item_status = item_status >>> 3) % 8,
    'neck': (item_status = item_status >>> 3) % 8,
    'wrist': (item_status = item_status >>> 3) % 8,
    'ring_left': (item_status = item_status >>> 3) % 8,
    'ring_right': (item_status >>> 3) % 8
  }
}

function dict_to_item_status(dict) {
  var a = 1;
  return dict['exist'] +
  (dict['weapon'] << a) +
  (dict['sub_weapon'] << (a = a+3)) +
  (dict['head'] << (a = a+3)) +
  (dict['chest'] << (a = a+3)) +
  (dict['hands'] << (a = a+3)) +
  (dict['waist'] << (a = a+3)) +
  (dict['legs'] << (a = a+3)) +
  (dict['feet'] << (a = a+3)) +
  (dict['ears'] << (a = a+3)) +
  (dict['neck'] << (a = a+3)) +
  ((dict['wrist'] << a) * 8) + // 2^31 (overflow)
  ((dict['ring_left'] << a) * 64) + // 2^34 (overflow)
  ((dict['ring_right'] << a) * 512) // 2^37 (overflow)
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
  text += ";path=/";
  document.cookie = text;
}

$(document).on('ready', function() {
  $(".item").each(function() {
    $(this).html(
      '<div class="pre_item"><div class="item_img"></div></div>'+
      '<div class="item_select_list">'+
        '<div class="outer_1"><div class="outer_2"><div class="outer_3"><div class="sheet">'+
          '<div class="item_select not_selected"><div class="item_select_img"></div></div>'+
          '<div class="item_select normal"><div class="item_select_img">일반</div></div>'+
          '<div class="item_select crafted"><div class="item_select_img">제작</div></div>'+
          '<div class="item_select slate"><div class="item_select_img">석판</div></div>'+
          '<div class="item_select augmented"><div class="item_select_img">보강</div></div>'+
          '<div class="item_select savage"><div class="item_select_img">영식</div></div>'+
        '</div></div></div></div>'+
      '</div>'
    );
  });

  $(".fix_add_icon").on('click', function() {
    if (unique_id === undefined) {
      alert("공대를 찾거나 생성해주세요!");
      return
    }
    var fix_type = $(this).parents('.fix_item_box').attr('id');
    var job = $(this).attr('job');
    FIX[fix_type].push(job);
    save_fix(fix_type);
  });

  setTimeout(function() {
    $(".item_select").on('click', function() {
      if (unique_id === undefined) {
        alert("공대를 찾거나 생성해주세요!");
      } else {
        var job = $(this).parents('.job_box').attr('id');
        var item_part = $(this).parents('.item').attr('class').split(' ')[1];
        var item_type = $(this).attr('class').split(' ')[1];
        var data_type = $(this).parents('.item').parent().attr('class');
        JOB[job][data_type][item_part] = to_item_code[item_type];
        save_job(job, data_type);
      }
    });
  }, 0);

  $("#find_input").on('keydown', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      $("#find_submit").click();
    }
  });
  $("#find_submit").on('click', function() {
    window.location.replace(window.location.origin+'?unique_id='+$("#find_input").val());
  });
  $("#make_input").on('keydown', function(e) {
    if (e.which === 13) {
      e.preventDefault();
      $("#make_submit").click();
    }
  });
  $("#make_submit").on('click', function() {
    make_team($("#make_input").val());
  });
  $(".menu").on('click', function() {
    $(".menu").removeClass('active');
    $(this).addClass('active');
    $(".tab").hide();
    $("."+$(this).attr('id')).show();
  });

  $(document).on('click', function(e) {
    if (['item', 'pre_item', 'item_img'].indexOf($(e.target).attr('class')) === -1) {
      $(".item").removeClass('active');
    }
    if (['add_job', 'fix_add_button'].indexOf($(e.target).attr('class')) === -1) {
      $(".add_job").removeClass('active');
    }
  });
  $(".item").on('click', function() {
    $(".item").removeClass('active');
    $(this).addClass('active');
  });
  $(".add_job").on('click', function() {
    $(".add_job").removeClass('active');
    $(this).addClass('active');
  });

  if (unique_id === undefined) {
    $("#find_team").click();
  } else {
    $("#overview").click();
    load_team(unique_id);
  }
});