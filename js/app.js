$(function() {

  var dataRef = new Firebase('https://lolscouting.firebaseio.com/-K6an61PPs23vCYREXaG/wards');

  dataRef.on('child_added', function(snapshot) {
    var data = snapshot.val();
    $('#wards tbody').append(
      "<tr>" +
        "<td>" + data.time + "</td>" +
        "<td>" + data.player + "</td>" +
        "<td>" + data.kind + "</td>" +
      "</tr>"
    )
  });


  $('#filter').keyup(function () {

    var rex = new RegExp($(this).val(), 'i');
    $('.searchable tr').hide();
    $('.searchable tr').filter(function () {
        return rex.test($(this).text());
    }).show();
  });

  var canvas = document.getElementById("canvas"),
      ctx = canvas.getContext("2d");

  canvas.width = 900;
  canvas.height = 755;

  var background = new Image();
  background.src = "img/map.jpg";

  var xLoc, yLoc;

  background.onload = function(){
    ctx.drawImage(background,0,0);
  };

  canvas.addEventListener('mousedown', handleClick, false);

  function handleClick(e) {
    getPosition(e);
    openDialog();
  }

  function getPosition(e) {
    var x = event.x;
    var y = event.y;

    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    xLoc = x;
    yLoc = y;
  }


  function openDialog() {
    $("#dialog").dialog(
      "open"
    );

    $('#x').val(xLoc);
    $('#y').val(yLoc);
  }

  function drawRect(kind) {
    var wardColor;

    if (kind === 'totem') {
      wardColor = 'yellow';
    } else if (kind === 'stone') {
      wardColor = 'green';
    } else if (kind === 'farsight') {
      wardColor = 'blue';
    } else if (kind === 'vision') {
      wardColor = 'pink';
    }

    x = Math.round(xLoc - 6);
    y = Math.round(yLoc - 6);
    ctx.fillStyle = wardColor;
    ctx.fillRect(x, y, 12, 12);
  }

  function createWard() {

      // Ward Data
      var time, player, kind, x, y, dragon, baron;
      var teamTowers = [];
      var oppTowers = [];
      time = $("#time").val();
      player = $("#player").val();
      kind = $("#kind").val();
      x = $("#x").val();
      y = $("#y").val();
      notes = $("#notes").val();

      dragon = $('input:radio[name=dragon]:checked').val();
      baron = $('input:radio[name=baron]:checked').val();

      $('input[name=team-towers]:checked').each(function(){
        teamTowers.push(this.value);
      });

      $('input[name=opp-towers]:checked').each(function(){
        oppTowers.push(this.value);
      });

      // Match Data
      dataRef.push(
        {
            time:time,
            player:player,
            kind:kind,
            x:x,
            y:y,
            dragon:dragon,
            baron:baron,
            teamTowers:teamTowers,
            oppTowers:oppTowers,
            notes:notes
        }
      );

      drawRect(kind);
      dialog.dialog("close");
    };


    dialog = $("#dialog").dialog({
      width: 450,
      autoOpen: false,
      buttons: {
        "Create a ward": createWard,
        Cancel: function() {
          dialog.dialog( "close" );
        }
      },
      close: function() {
        form[ 0 ].reset();
      }
    });

    form = dialog.find( "form" ).on( "submit", function( event ) {
      event.preventDefault();
      createWard();
    });
});
