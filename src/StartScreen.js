
function StartScreen() {
  this.mouseClick = 0;
}

StartScreen.load = function() {
  StartScreen.title = loader.loadImage("img/title.png");
  StartScreen.button = loader.loadImage("img/misc/button large.png");
}

StartScreen.prototype.draw = function(ctx) {
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  var w = 320, h = 240;
  var x = (ctx.canvas.width - w) / 2, y = (ctx.canvas.height - h) / 2;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);

  var img = StartScreen.title;
  var button = StartScreen.button;
  ctx.drawImage(img, 120, 80, 80, 60);
  ctx.drawImage(button, 95, 180, 128, 16);
  ctx.textAlign = "center";
  ctx.fillText("Press any Key to start", 158, 191);

}