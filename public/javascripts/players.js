var players = new function() {

  this.info;
  this.myColor;
  this.winner;

  this.setup = function() {
    // Setup events
    $A(["w", "b"]).each(function(c) {
      $("player" + c).select(".playerLeave")[0].observe("click", function(ev) {
        new Ajax.Request(window.location.pathname + "/leave", {
          method: 'post'
        });
        $("player" + c).select(".playerLoading")[0].show();
        ev.stop();
      });
      $("player" + c).select(".playerJoin")[0].observe("click", function(ev) {
        new Ajax.Request(window.location.pathname + "/join/" + c, {
          method: 'post'
        });
        $("player" + c).select(".playerLoading")[0].show();
        ev.stop();
      });
      $("player" + c).select(".playerComputer")[0].observe("click", function(ev) {
        var computersList = $("player" + c).select(".playerComputers")[0];
        if (computersList.visible()) {
          computersList.hide();
        } else {
          $$(".playerComputers").invoke('hide');
          computersList.show();
        }
        ev.stop();
      });
      $("player" + c).select(".playerComputers li").invoke("observe", "click", function(ev) {
        new Ajax.Request(window.location.pathname + "/join/" + c + "/" + this.innerHTML, {
          method: 'post'
        });
        $("player" + c).select(".playerComputers")[0].hide();
        $("player" + c).select(".playerLoading")[0].show();
        ev.stop();
      });
    });
  };

  this.render = function() {
    var content;
    // Render joining, leaving, loading and computer icons
    $A(["w", "b"]).each(function(c) {
      $("player" + c).select(".playerJoin, .playerLeave, .playerLoading, .playerComputer").invoke("hide");
      if (this.winner) { return; }
      if (!Object.isUndefined(this.info[c])) { // This player is already in
        if (this.myColor == c) {
          $("player" + c).select(".playerLeave")[0].show(); // TODO: create a helper for $("player" + c).select(...), and cache results.
          $("player" + c).select(".playerName")[0].update("(Me)");
        } else {
          if (this.info[c]) {
            $("player" + c).select(".playerName")[0].update(this.info[c]);
            if (this.turn() == c) {
              $("player" + c).select(".playerLoading")[0].show();
            } else {
              $("player" + c).select(".playerLoading")[0].hide();
            }
          } else {
            $("player" + c).select(".playerName")[0].update("(Player)");
          }
        }
      } else {
        $("player" + c).select(".playerName")[0].update("(Empty)");
          $("player" + c).select(".playerComputer").invoke("show");
        if (!this.myColor) {
          $("player" + c).select(".playerJoin").invoke("show");
        }
      }
    }.bind(this));
    // Render turn indication, winner and loser
    $$(".turnIndicator").invoke("writeAttribute", "src", "/images/icons/transparent.png"); // TODO: can make change only if needed
    if (this.winner) {
      $("player" + this.winner).select(".turnIndicator").invoke("writeAttribute", "src", "/images/icons/winner.png");
      $("player" + $A(["w", "b"]).without(this.winner).first()).select(".turnIndicator").invoke("writeAttribute", "src", "/images/icons/loser.png");
    } else {
      $("player" + this.turn()).select(".turnIndicator").invoke("writeAttribute", "src", "/images/icons/pointer.png");
    }
  };

  this.iHaveTurn = function() {
    return !this.winner && this.myColor && (this.myColor == this.turn());
  };

  this.turn = function() {
    return this.winner ? "" : (moves.size() % 2 ? "b" : "w");
  };

};
