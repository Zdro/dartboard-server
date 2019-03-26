var game = null;

$(function () {
  var socket = io();

  function generatePlayersTable(game) {
    var table = '';
    if (game.winnerIdx != undefined) {
      table += `<h3>Winner ! ${game.players[game.winnerIdx].name}</h3>`
    } else if (game.waitingForNextRound)
      table += '<h3>Waiting for next turn...</h3>'
    else {
      table += `<h3>${game.players[game.currentPlayerIdx].name} is playing...</h3>`
    }
    table += `<table style="table-layout: fixed">
                <thead>
                  <tr>
                    <th style="width:75px"></th>`;
    game.players.forEach((player, i) => {
      table += `    <th class="center-align ${i == game.currentPlayerIdx ? 'light-blue lighten-4' : ''}"><h2 style="margin:0px">${player.name}</h2></th>`;
    });
    table += `    </tr>
                </thead>
              <tbody>
                <tr>
                  <td class="center-align" style="font-weight:bold">Score</td>`;
    game.players.forEach((player, i) => {
      table += `  <td class="center-align lighten-4 ${i == game.currentPlayerIdx ? 'light-blue' : ''}"><h2 style="margin:0px">${player.score.score}</h2></td>`;
    });
    table += '  </tr>';

    if (game.objective.segments) {
      game.objective.segments.forEach((segment, i) => {
        table += `<tr>
                    <td class="center-align" style="font-weight:bold"><h2 style="margin:0px">${segment}</h2></td>`;
        game.players.forEach((player, j) => {
          table += `<td class="center-align lighten-4 
                            ${j == game.currentPlayerIdx ? 'light-blue' : ''}
                            ${player.score.segments[i] == 3 ? 'light-green' : ''}
                            "
                    >
                     <h2 style="margin:0px"> ${player.score.segments[i] != 0 ? player.score.segments[i] : ''}</h2>
                    </td>`
        })
        table += '</tr>';
      })


    }

    table += '  </tbody>';
    table += '</table>'

    return table;
  }

  $("#dartboard path, #d25, #start_round, #stop_round").click(function () {
    socket.emit('hit', this.id);
  });

  socket.on('game', function (data) {
    var obj = JSON.parse(data);
    game = obj;
    $('#scoreTable').html(generatePlayersTable(game));
    
    var rounds = game.players[game.currentPlayerIdx].rounds
    var darts = {}
    var lastDart = {}
    if (rounds.length > 0){
      darts = rounds[rounds.length - 1].darts
      if (darts.length > 0)
        lastDart = darts[darts.length - 1]
  
    }
    console.log(

      JSON.stringify(lastDart, null,2)
      )
     		
    $('.brand-logo').text(game.name);
  })
});
