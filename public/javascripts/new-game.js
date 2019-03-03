function addNewPlayer(){
    var nbPlayers = $('#nb-players').val();
    nbPlayers++;
    $('#nb-players').val(nbPlayers);
    var template = `
    <div id="player-${nbPlayers}-wrapper" class="row">
        <div class="input-field col s8">
            <input id="player-${nbPlayers}" type="text" name="playerName" class="validate">
            <label for="player-${nbPlayers}">Name</label>
        </div>
        <div class="input-field col s4">
            <a class="btn waves-effect waves-light" href="#" onClick="deletePlayer('${nbPlayers}')">
                <i class="material-icons">delete</i>
            </a>
        </div>
    </div>
    `;
    $('#players').append(template);
}

function deletePlayer(playerNumber){
    var nbPlayers = $('#nb-players').val();
    $('#nb-players').val(nbPlayers--);
    $(`#player-${playerNumber}-wrapper`).remove();
}