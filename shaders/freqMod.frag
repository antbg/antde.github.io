precision mediump float;

uniform vec3 u_resolution;
uniform float u_time;
uniform float v_freq;

vec3 P1ColorIn = vec3(0.7, 0.7, 0.7);
vec3 P1ColorOut = vec3(0.5, 0.5, 0.5);

float map(float value, float min1, float max1, float min2, float max2) {
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float a = 16.0;
  float b = 28.0;
  float x = map(uv.x, 0.0, 1.0, -1.0, 1.0);
  float m = map(x, -1.0, 0.0, a, b);
  if (x >= 0.0) {
    m = map(x, 0.0, 1.0, b, a);
  }
  
  float curve = 0.1 * sin(m * x + u_time);

  float sineShape = smoothstep(1.0 - clamp(distance(curve + uv.y, 0.5) * 3.0, 0.0, 1.0), 1.0, 0.99);
  vec4  sineColor = (1.0 - sineShape) * vec4(mix(P1ColorIn, P1ColorOut, sineShape), 0.5);

  gl_FragColor = sineColor;
}
