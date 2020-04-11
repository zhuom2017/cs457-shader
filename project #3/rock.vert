#version 330 compatibility

uniform float uA, uB, uC, uD;
uniform float uLightX, uLightY, uLightZ;

out vec3 vMCposition;
out vec3 vECposition;

flat out vec3 vNf;
out vec3 vNs;
flat out vec3 vLf;
out vec3 vLs;
flat out vec3 vEf;
out vec3 vEs;

vec3 eyeLightPosition = vec3( uLightX, uLightY, uLightZ );
float pi = 3.141592654;

void
main( )
{
	float x=gl_Vertex.x;
	float y=gl_Vertex.y;
	float r = sqrt(pow(x,2) + pow(y,2));
    float pi = 3.141592654;

	float z = uA*cos(2*pi*uB*r+uC)*exp(-uD*r);
  vec4 glVertex = gl_Vertex.xyzw;
  glVertex.z = z;

	//dzdx = dzdr*drdx
  //dzdy = dzdr*drdy
  float dzdr = uA*(-sin(2.*pi*uB*r+uC) * 2.*pi*uB * exp(-uD*r) + cos(2.*pi*uB*r+uC) * -uD * exp(-uD*r));
  float dzdx = dzdr*x/r;
  float dzdy = dzdr*y/r;

	vec3 Tx = vec3(1., 0., dzdx );
	vec3 Ty = vec3(0., 1., dzdy );
	vec3 normal = normalize(cross(Tx, Ty));

	vec4 ECposition = gl_ModelViewMatrix * glVertex;
	vNf = normalize(gl_NormalMatrix * normal);	// surface normal vector
	vNs = vNf;
	vLf = eyeLightPosition - ECposition.xyz; 			// vector from the point
	vLs = vLf; 											// to the light position
	vEf = vec3( 0., 0., 0. ) - ECposition.xyz; 			// vector from the point
	vEs = vEf ; 										// to the eye position
	vMCposition = glVertex.xyz;
	gl_Position = gl_ModelViewProjectionMatrix * glVertex;
}
