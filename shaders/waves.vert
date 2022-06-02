precision mediump float;

attribute vec3 aPosition;
// uniform vec3 u_resolution;

void main() {
  // vec3 pos = aPosition / u_resolution * 3.0 - 1.0;
  // gl_Position = vec4(pos.x,-pos.y, 0.0, 1.0);
  
  vec4 positionVec4 = vec4(aPosition, 1.0);
  positionVec4.xy = positionVec4.xy * 3.0 - 1.0;
  gl_Position = positionVec4;
}
