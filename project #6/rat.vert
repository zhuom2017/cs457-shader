#version 330 compatibility

out vec3 vRefractVector;
out vec3 vReflectVector;
out vec3 eyeDir;

uniform float uEta;

void
main( )
{
		vec3 ECposition= vec3( gl_ModelViewMatrix* gl_Vertex);
		vec3 eyeDir= normalize( ECposition - vec3(0.,0.,0. )  );
		vec3 normal = normalize( gl_NormalMatrix* gl_Normal);
		vRefractVector= refract( eyeDir, normal, uEta);
		vReflectVector= reflect(  eyeDir, normal );
		gl_Position= gl_ModelViewProjectionMatrix* gl_Vertex;
}
