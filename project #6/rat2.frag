#version 330 compatibility

uniform float uAd;
uniform float uBd;
uniform float uTol;
uniform float uNoiseAmp;
uniform float uNoiseFreq;
uniform float uAlpha;
uniform bool  uUseChromaDepth;
uniform float uChromaBlue;
uniform float uChromaRed;

in float vLightIntensity;
in vec2 vST;
in vec3 MCposition;
in vec3 ECposition;

uniform sampler3D Noise3;

const vec3 WHITE = vec3( 1., 1., 1. );
const vec3 ORANGE = vec3( 1., 0.5, 0. );

vec3 Rainbow(float);

void
main( )
{
  float Ar = uAd/2;
  float Br = uBd/2;

  int numins = int (vST.s/uAd);
  int numint = int (vST.t/uBd);

  // read the glman noise texture and convert it to a range of [-1.,+1.]:
  vec4 nv  = texture3D( Noise3, uNoiseFreq*MCposition );
  float n = nv.r + nv.g + nv.b + nv.a;    //  1. -> 3.
  n = n - 2.;                             // -1. -> 1.
  n = uNoiseAmp * n;

  // determine the color based on the noise-modified (s,t):

  float sc = float(numins) * uAd  +  Ar;
  float ds = vST.s - sc;                   // wrt ellipse center
  float tc = float(numint) * uBd  +  Br;
  float dt = vST.t - tc;                   // wrt ellipse center

  float oldDist = sqrt( ds*ds + dt*dt );
  float newDist = oldDist + n;
  float scale = newDist / oldDist;        // this could be < 1., = 1., or > 1.

  ds *= scale;                            // scale by noise factor
  ds /= Ar;                               // ellipse equation

  dt *= scale;                            // scale by noise factor
  dt /= Br;                               // ellipse equation

  float d = ds*ds + dt*dt;
  vec3 theColor = mix(ORANGE, WHITE, smoothstep(1.-uTol, 1.+uTol, d));


//Extra Credit #2
  if( uUseChromaDepth )
  {
    float t = (2./3.) * ( ECposition.z - uChromaRed ) / ( uChromaBlue - uChromaRed );//1027
    t = clamp( t, 0., 2./3. );
    theColor = mix(Rainbow(t), WHITE, smoothstep(1.-uTol, 1.+uTol, d));
  }

  //Extra Credit #1
    if(uAlpha == 0 && theColor == WHITE){
      discard;
    }

  gl_FragColor = vec4(vLightIntensity*theColor,1);

}


vec3
Rainbow( float d )
{
	d = clamp( d, 0., 1. );

	float r = 1.;
	float g = 0.0;
	float b = 1.  -  6. * ( d - (5./6.) );

        if( d <= (5./6.) )
        {
                r = 6. * ( d - (4./6.) );
                g = 0.;
                b = 1.;
        }

        if( d <= (4./6.) )
        {
                r = 0.;
                g = 1.  -  6. * ( d - (3./6.) );
                b = 1.;
        }

        if( d <= (3./6.) )
        {
                r = 0.;
                g = 1.;
                b = 6. * ( d - (2./6.) );
        }

        if( d <= (2./6.) )
        {
                r = 1.  -  6. * ( d - (1./6.) );
                g = 1.;
                b = 0.;
        }

        if( d <= (1./6.) )
        {
                r = 1.;
                g = 6. * d;
        }

	return vec3( r, g, b );
}
