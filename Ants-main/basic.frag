precision highp float;

// A custom uniform to control the color
uniform vec4 myColor;

void main(){
  gl_FragColor=vec4(0.,0.,0.,1.);
  //gl_FragColor=myColor;
}