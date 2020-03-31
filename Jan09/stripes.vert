#version 330 compatibility

uniform bool uModelCoordinates;

out vec4 vColor;
out float vX, vY;
out float vLightIntensity; 

const vec3 LIGHTPOS = vec3( 0., 0., 10. );

void
main( )
{
	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	vec3 ECposition = ( gl_ModelViewMatrix * gl_Vertex ).xyz;
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	vColor = gl_Color;
	vec3 MCposition = gl_Vertex.xyz;
	if( uModelCoordinates )
	{
		vX = MCposition.x;
		vY = MCposition.y;
	}
	else
	{
		vX = ECposition.x;
		vY = ECposition.y;
	}
	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
