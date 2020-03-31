#version 330 compatibility

uniform float uA, uB, uC, uD;

out vec3 vMCposition;
out vec3 vECposition;
out vec3 eyeDir;

flat out vec3 vNf;
out vec3 vNs;

float pi = 3.141592654;

void
main( )
{
	float x=gl_Vertex.x;
	float y=gl_Vertex.y;
	float r = sqrt(pow(x,2) + pow(y,2));

	float z = uA*cos(2*pi*uB*r+uC)*exp(-uD*r);
  vec4 glVertex = vec4(x,y,z,gl_Vertex.w);

	//dzdx = dzdr*drdx
  //dzdy = dzdr*drdy
  float dzdr = uA*(-sin(2.*pi*uB*r+uC) * 2.*pi*uB * exp(-uD*r) + cos(2.*pi*uB*r+uC) * -uD * exp(-uD*r));
  float dzdx = dzdr*x/r;
  float dzdy = dzdr*y/r;

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vNf = normalize(gl_NormalMatrix * normalize(cross(Tx, Ty)));	// surface normal vector
	vNs = vNf;

	vECposition = vec3( gl_ModelViewMatrix * glVertex );
	eyeDir = normalize( vECposition - vec3(0.,0.,0.));

	vMCposition = glVertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * glVertex;
}
