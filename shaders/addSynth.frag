precision mediump float;

uniform vec3 u_resolution;
uniform float u_time;
uniform float v_freq;
uniform float v_harm;

vec3 P1ColorIn = vec3(0.7, 0.7, 0.7);
vec3 P1ColorOut = vec3(0.5, 0.5, 0.5);

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;

  float curve = 0.05 * sin(v_freq * uv.x + u_time);
  curve += 0.05 * sin(v_freq * v_harm * uv.x + u_time);

  float sineShape = smoothstep(1.0 - clamp(distance(curve + uv.y, 0.5) * 2.5, 0.0, 1.0), 1.0, 0.99);
  vec4  sineColor = (1.0 - sineShape) * vec4(mix(P1ColorIn, P1ColorOut, sineShape), 0.5);

  gl_FragColor = sineColor;
}
