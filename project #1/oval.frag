#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;

in float vX, vY;
in vec3 vColor;
in float vLightIntensity;
in vec2 vST;

const vec3 WHITE = vec3( 1., 1., 1. );
const vec3 ORANGE = vec3( 1., .5, 0. );

void
main( )
{
  float Ar = uAd/2;
  float Br = uBd/2;

  float s = vST.s;
  float t = vST.t;

  int numins = int (s/uAd);
  int numint = int (t/uBd);

  float Sc = numins * uAd + Ar;
  float Tc = numint * uBd + Br;

  float d = smoothstep( 1. - uTol, 1. + uTol, ((s-Sc)/Ar)*((s-Sc)/Ar) + ((t-Tc)/Br)*((t-Tc)/Br) );
  vec3 rgb = vLightIntensity*mix(ORANGE, WHITE, d);

  gl_FragColor = vec4(rgb,1);
}
