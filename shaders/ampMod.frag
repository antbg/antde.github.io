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

  float l = 0.4;
  float m = map(uv.x, 0.0, 1.0, 0.01, l);
  if (uv.x > 0.5) {
    m = l - m;
  }
  float curve = sin(v_freq * uv.x + u_time) * m;

  float sineShape = smoothstep(1.0 - clamp(distance(curve + uv.y, 0.5) * 2.5, 0.0, 1.0), 1.0, 0.99);
  vec4  sineColor = (1.0 - sineShape) * vec4(mix(P1ColorIn, P1ColorOut, sineShape), 0.5);

  gl_FragColor = sineColor;
}
