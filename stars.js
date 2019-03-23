var dd = document.createElement("canvas");
var cv = dd.getContext("2d");
var sw = window.screen.width;
var sh = window.screen.height;
var vcx = document.body.clientWidth/2;
var vcy = document.body.clientHeight/2;
var rv = 1000;
var rot = 0;
var dim = Math.sqrt((sw*sw)+(sh*sh));
var w = dd.width = dim;
var h = dd.height = dim;
var strs = [];
var nstrs = 1500;

document.body.appendChild(dd);
function rInt(s,b) {
  min=Math.ceil(s);max=Math.floor(b);
  return Math.floor(Math.random()*(b-s+1))+s;
}
function Star(x,y,sz,s,o) {
	this.x = parseInt(x);
	this.y = parseInt(y);
  this.radius = parseInt(sz);
	this.speed = parseInt(s);
	this.opacity = o;
  this.draw = function(){
    cv.beginPath();
    cv.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    cv.closePath();
    cv.fillStyle = "rgba(255,255,255,"+this.opacity+")";
    cv.fill();
  }
}
function draw() {
  cv.clearRect(0,0,w,h);
  for(i=0; i<nstrs;i++){
    strs[i].draw();
    strs[i].y += strs[i].speed/1.5;
    if(strs[i].y >= 2000){
      strs[i] = new Star(rInt(0, w),0,rInt(1,6)/3,rInt(1,3),rInt(4,10)/10);
    }
  }
  window.requestAnimationFrame(draw);
}
function init() {
  for(i=0; i<nstrs;i++) {
    strs[i] = new Star(rInt(0,w),rInt(0,h),rInt(1,6)/3,rInt(1,5),rInt(4,10)/10);
  }
  draw();
}
init();
