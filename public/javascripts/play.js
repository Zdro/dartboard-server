var game = null;

$(function () {
  var socket = io();
  
  function generatePlayersTable(game){
    var table = '';
    if (game.winnerIdx != undefined){
      table += `<h3>Winner ! ${game.players[game.winnerIdx].name}</h3>`
    }
    else if (game.waitingForNextRound)
      table += '<h3>Waiting for next turn...</h3>'
    else
      table += `<h3>${game.players[game.currentPlayerIdx].name} is playing...</h3>`
    table += '<table style="table-layout: fixed">'
    table += '  <thead>';
    table += '    <tr>';
    table += '    <th></th>'
    game.players.forEach((player, i) => {
      table += `    <th class="center-align ${i == game.currentPlayerIdx ? 'light-blue lighten-4' : ''}">${player.name}</th>`;  
    });
    table += '    </tr>';
    table += '  </thead>';
    table += '  <tbody>';
    table += '    <tr>';
    table += '    <td>Score</td>';
    game.players.forEach((player, i) => {
      table += `    <td class="center-align ${i == game.currentPlayerIdx ? 'light-blue lighten-4' : ''}">${player.score.score}</th>`;
    });
    table += '    </tr>';

    if (game.objective.segments){
      game.objective.segments.forEach((segment, i) => {
        table += '<tr>';
        table += `<td>${segment}</td>`
        game.players.forEach((player, j) => {
          table += `<td class="center-align ${j == game.currentPlayerIdx ? 'light-blue lighten-4' : ''}">${player.score.segments[i]}</td>`
        })
        table += '</tr>';
      })

      
    }

    table += '  </tbody>';
    table += '</table>'

    return table;
  }
  
  $("#dartboard path, #d25, #start_round").click(function(){
    socket.emit('hit', this.id);
  });

  socket.on('game', function(data){
    var obj = JSON.parse(data);
    game = obj;
    $('#scoreTable').html(generatePlayersTable(game));
    if (game.objective.segments){

    }
  })
});