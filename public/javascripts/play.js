let game = null;

$(function () {
  let socket = io();

  function generatePlayersTable(game) {
    let table = '<h3>&nbsp;</h3>';
    table += `<table style="table-layout: fixed">
                <thead>
                  <tr>
                    <th style="width:12em"></th>`;
    game.players.forEach((player, i) => {
      table += `    <th class="center-align ${i == game.currentPlayerIdx ? 'light-blue lighten-4' : ''}"><h2 style="margin:0px">${player.name}</h2></th>`;
    });
    table += `    </tr>
                </thead>
              <tbody>
                <tr>
                  <td class="center-align" style="font-weight:bold"><h2 style="margin:0px">Score</h2></td>`;
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

  function displayCurrentRound(game){
    let currentRound;
    let currentPlayer = game.currentPlayerIdx;
    let dartLeft;

    if (game.waitingForNextRound){
      currentPlayer = currentPlayer - 1 < 0 ? game.players.length - 1 : currentPlayer - 1;
      currentRound = game.players[currentPlayer].rounds[game.players[currentPlayer].rounds.length - 2]
    }
    else{
      currentRound = game.players[currentPlayer].rounds[game.players[currentPlayer].rounds.length - 1]
    }
    dartLeft = 3 - currentRound.darts.length;

    let table = '';
    if (game.winnerIdx != undefined) {
      table += `<h3>Winner ! ${game.players[game.winnerIdx].name}</h3>`
    } else if (game.waitingForNextRound)
      table += '<h3>Waiting for next turn...</h3>'
    else {
      table += `<h3>${game.players[game.currentPlayerIdx].name} is playing... ${dartLeft} darts left</h3>`
    }

    table += `<table style="table-layout: fixed">
                <thead></thead>
                <tbody>
            `;
    for (let i = 0; i < currentRound.darts.length; i++){
      table += `  <tr>
                    <td class="center-align" style="font-weight:bold">
                      <h2 style="margin:0px">
                        ${i + 1}
                      </h2>
                    </td>
                    <td class="center-align" style="font-weight:bold">
                      <h2 style="margin:0px">
                        ${currentRound.darts[i].name.substr(0,1).toUpperCase() + ' ' + currentRound.darts[i].name.substr(1) }
                      </h2>
                    </td>
                  </tr>

      `
    }

    table += `</tbody>
            </table`;

    $('#currentRound').html(table);
    console.log(currentRound);
  }

  $("#dartboard path, #d25, #start_round, #stop_round").click(function () {
    socket.emit('hit', this.id);
  });

  socket.on('game', function (data) {
    let obj = JSON.parse(data);
    game = obj;
    $('#scoreTable').html(generatePlayersTable(game));
    displayCurrentRound(game);    		
    $('.brand-logo').text(game.name);
  })

  $(document).keypress(function(e) {
    if (e.key == ' '){
      $('#start_round').click();
    }
    else if (e.key == 'Enter'){
      $('#stop_round').click();
    }
  });
});
