var g;

$(function () {
  var socket = io();
  
  function generatePlayersTable(game){
    var table = '';
    if (game.winnerIdx){
      table += `<h3>Winner ! ${game.players[game.winnerIdx].name}</h3>`
    }
    else if (game.waitingForNextRound)
      table += '<h3>Waiting for next turn...</h3>'
    else
      table += `<h3>${game.players[game.currentPlayerIdx].name} is playing...</h3>`
    table += '<table>'
    table += '  <thead>';
    table += '    <tr>';
    game.players.forEach(player => {
      table += `    <th>${player.name}</th>`;  
    });
    table += '    </tr>';
    table += '  </thead>';
    table += '  <tbody>';
    table += '    <tr>';
    game.players.forEach(player => {
      table += `    <td>${player.score}</th>`;  
    });
    table += '    </tr>';
    table += '  </tbody>';
    table += '</table>'

    return table;
  }
  
  $("#dartboard path, #d25, #start_round").click(function(){
    socket.emit('hit', this.id);
  });

  socket.on('game', function(data){
    var obj = JSON.parse(data);
    g = obj;
    $('#scoreTable').html(generatePlayersTable(obj));
  })
});