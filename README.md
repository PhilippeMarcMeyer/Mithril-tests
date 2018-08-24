# P5js
Playing with p5.js

This is a translation in javascript/p5.js 
of Daniel Shiffman's coding challenge : 
Spherical Geometry from processing (java).

https://github.com/CodingTrain/website/tree/master/CodingChallenges/CC_025_SphereGeometry

Colours are very different as I didn't used
colorMode(HSB);
but the default :
colorMode(RVB);

For the background I used an offscreen 2D canvas to draw the stars and later textured it :
texture(_text);
plane(640,480);
thanks to Adil Rabbani, member of Processing Foundation :
Implement text() for webgl mode

DEMO SphereGeometry : https://philippemarcmeyer.github.io/demo-p5js.html

See also SuperShapes which includes part of this script and brings it beyond

DEMO SuperShapes : https://philippemarcmeyer.github.io/demo-supershapes.html
