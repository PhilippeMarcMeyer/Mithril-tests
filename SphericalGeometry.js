/*
	x = r sin(Lon) cos(lat)
	y = r sin(Lon) sin(lat)
	z = r cos(Lon)
	
	translated from https://github.com/CodingTrain/website/blob/master/CodingChallenges/CC_026_SuperShape3D/CC_026_SuperShape3D.pde
	in p5.js
*/

var globals = {
	r : 140,
	definition : 90,
	starNr : 75,
	globe : [],
	offset : 0,
	auto : false,
	initialRotation : null,
	lastRotationX:0.5,
	lastRotationY:0,
	lastRotationZ:0,
	startBg :null,
	w : 640,
	h : 480,
	sunLight : null,
	colors :[
		{r:116,g:73,b:73},
		{r:128,g:64,b:64},
		{r:154,g:78,b:78},
		{r:172,g:89,b:89},
		{r:187,g:106,b:102},
		{r:197,g:137,b:92},
		{r:197,g:137,b:92},
		{r:68,g:146,b:46},
		{r:68,g:146,b:46},
		{r:87,g:186,b:58},
		{r:255,g:108,b:108},
		{r:255,g:255,b:255}
	]
};

 function setup(){
  var cnv = createCanvas(globals.w,globals.h,WEBGL);
  cnv.parent('demoZone');
  cnv.mousePressed(function(){
	 globals.auto = !globals.auto;
  });
  
  globals.sunLight = createVector(-HALF_PI,0.5,HALF_PI+0.1);
  globals.lastRotationX = HALF_PI;
  frameRate(30);
  globals.startBg = createGraphics(globals.w,globals.h);

  globals.startBg.fill(245);
  
  globals.globe = [];
 
var rxOld = random(-100,globals.w+100); 
var ryOld = random(globals.h); 
globals.startBg.stroke(255);
	
 for(var i = 0;i < globals.starNr;i++){
	var rx = random(globals.w); 
	var ry = random(globals.h); 
	globals.startBg.line(rxOld,ryOld,rx,ry);
	rxOld = rx;
	ryOld = ry;
 }

globals.startBg.filter(ERODE,DILATE); // DILATE ,BLUR ,POSTERIZE,
globals.startBg.ellipseMode(CENTER)
globals.startBg.stroke("yellow");
 globals.startBg.translate(globals.w/2,globals.h/2);
 var scale = 1 - globals.sunLight.z;
 var startBeam = {x:globals.sunLight.x*globals.w/scale,y:globals.sunLight.y*globals.h/scale};
  globals.startBg.ellipse(startBeam.x,startBeam.y,10 / scale,10 / scale);
 var endBeam = {x:0,y:0};


  //globals.startBg.ellipse(endBeam.x,endBeam.y,10 / scale,10 / scale);
  //globals.startBg.line(startBeam.x,startBeam.y,endBeam.x,endBeam.y);

var frontier = globals.definition+1 / 2;
 globals.globe = [];
	for(var i = 0; i < globals.definition+2; i++){
		var lat = map(i,0,globals.definition,0, PI);
		globals.globe.push([]);
		for(var j = 0; j < globals.definition+2; j++){
			var lon = map(j,0,globals.definition+1,0,  TWO_PI);
			
			var x = sin(lat) * cos(lon);
			var y = sin(lat) * sin(lon);
			var z = cos(lat);
			var normale = createVector(x,y,z);
			x = globals.r * x;
			y = globals.r * y;
			z = globals.r * z;
			var pt = createVector(x,y,z);
			
			globals.globe[i].push({"point":pt,"normale":normale});
		}
	}
	
	for(var i = 1; i < globals.definition+1; i++){
		for(var j = 0; j < globals.definition+2; j++){
				globals.globe[i][j].point = doRotate(globals.globe[i][j].point,0,HALF_PI,0);
				globals.globe[i][j].normale.x = globals.globe[i][j].point.x / globals.r;
				globals.globe[i][j].normale.y = globals.globe[i][j].point.y / globals.r;
				globals.globe[i][j].normale.z = globals.globe[i][j].point.z / globals.r;

			}
    }
 }
 globals.offset=0;
 
var deltaZ = 0.002;
var deltaX = 0.005;
var deltaY = 0;	
 function draw(){	 
  background(0);

  texture(globals.startBg);
  plane(globals.w,globals.h);



	if(abs(globals.lastRotationZ) >= 0.3){
		deltaZ*=-1;
		
	}

	globals.lastRotationX+=deltaX;
	globals.lastRotationZ+=deltaZ;	
		



	if(deltaX!=0){
			for(var i = 1; i < globals.definition+1; i++){
				for(var j = 0; j < globals.definition+2; j++){
				globals.globe[i][j].point = doRotate(globals.globe[i][j].point,deltaX,deltaY,deltaZ);
				globals.globe[i][j].normale.x = globals.globe[i][j].point.x / globals.r;
				globals.globe[i][j].normale.y = globals.globe[i][j].point.y / globals.r;
				globals.globe[i][j].normale.z = globals.globe[i][j].point.z / globals.r;

			}
			}
	}
	
	for(var i = 1; i < globals.definition+1; i++){
		
	
		beginShape(TRIANGLE_STRIP);
		for(var j = 0; j < globals.definition+2; j++){
			var color = {r:45,g:45,b:55};
			var dot = scalarProduct(globals.globe[i][j].normale,globals.sunLight);
			 if(dot >= 0){
				 var lightStrength = round(dot*dot*30);
				color.r += lightStrength;
				color.g += lightStrength;
				color.b += lightStrength*0.9;
			 }
			if(dot >= 0.6){
				 var lightStrength = 1;
				color.r += lightStrength;
				color.g += lightStrength;
				color.b += lightStrength;
			 } 
			fill(color.r,color.g,color.b);
			//stroke(color.r,color.g,color.b);
			var v1 = globals.globe[i][j].point;	
			vertex(v1.x,v1.y,v1.z);
			var v2 = globals.globe[i-1][j].point;
			vertex(v2.x,v2.y,v2.z);
		}
		endShape();
	}
 }
 
function scalarProduct(a,b){
	return a.x*b.x+a.y*b.y+a.z*b.z;
}


function doRotate(vect,pitch, roll, yaw) {
    var cosa = Math.cos(yaw);
    var sina = Math.sin(yaw);

    var cosb = Math.cos(pitch);
    var sinb = Math.sin(pitch);

    var cosc = Math.cos(roll);
    var sinc = Math.sin(roll);

    var Axx = cosa*cosb;
    var Axy = cosa*sinb*sinc - sina*cosc;
    var Axz = cosa*sinb*cosc + sina*sinc;

    var Ayx = sina*cosb;
    var Ayy = sina*sinb*sinc + cosa*cosc;
    var Ayz = sina*sinb*cosc - cosa*sinc;

    var Azx = -sinb;
    var Azy = cosb*sinc;
    var Azz = cosb*cosc;

	var px = vect.x;
	var py = vect.y;
	var pz = vect.z;

	vect.x = Axx*px + Axy*py + Axz*pz;
	vect.y = Ayx*px + Ayy*py + Ayz*pz;
	vect.z = Azx*px + Azy*py + Azz*pz;
		
	return vect;
}

/*

vectorNormal=new vector(pointA.x,pointA.y,pointA.z);
dot=scalarProduct(vectorNormal,this.camera);
*/