#version 330 compatibility

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

uniform bool  uSmooth;
uniform float uSize;
uniform float uTol;
uniform vec4  uSquareColor;

void
main( )
{
	float halfSize = uSize/2.;

	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;		// good for spheres
	float tp = t;
	int numins = int( sp / uSize );
	int numint = int( tp / uSize );

	gl_FragColor = vColor;		// default color

	if( ( (numins+numint) % 2 ) == 0 )
	{
		if( uSmooth )
		{
			float scenter = float(numins)*uSize + halfSize;
			float tcenter = float(numint)*uSize + halfSize;
			float ds = abs(sp - scenter);	// 0. <= ds <= halfSize
			float dt = abs(tp - tcenter);	// 0. <= dt <= halfSize
			float maxDist = max( ds, dt  );
			float t = smoothstep( halfSize-uTol, halfSize+uTol, maxDist );
			gl_FragColor = mix( uSquareColor, vColor, t );
		}
		else
		{
			gl_FragColor = uSquareColor;
		}
	}

	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}
