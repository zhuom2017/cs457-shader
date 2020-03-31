#version 330 compatibility

out float vLightIntensity;
out vec2 vST;
out vec3 MCposition;
out vec3 ECposition;

vec3 LIGHTPOS   = vec3( -2., 0., 10. );

void
main()
{
	vST = gl_MultiTexCoord0.st;

	vec3 tnorm = normalize( gl_NormalMatrix * gl_Normal );
	ECposition = vec3( gl_ModelViewMatrix * gl_Vertex );
	vLightIntensity  = abs( dot( normalize(LIGHTPOS - ECposition), tnorm ) );

	MCposition  = gl_Vertex.xyz;

	gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex;
}
