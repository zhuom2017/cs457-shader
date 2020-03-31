#version 330 compatibility

in float vX, vY;
in vec4  vColor;
in float vLightIntensity; 

uniform float uA;
uniform float uP;
uniform float uTol;

const vec4 WHITE = vec4( 1., 1., 1., 1. );

void
main( )
{
	float f = fract( uA*vX );
	
	float t = smoothstep( 0.5-uP-uTol, 0.5-uP+uTol, f )  -  smoothstep( 0.5+uP-uTol, 0.5+uP+uTol, f );
	gl_FragColor = mix( WHITE, vColor, t );
	gl_FragColor.rgb *= vLightIntensity;
}
