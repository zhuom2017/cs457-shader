#version 330 compatibility

in vec4  vColor;
in float vLightIntensity;
in vec2  vST;

uniform bool  uUseDiscard;
uniform float uSize;

void
main( )
{
	float s = vST.s;
	float t = vST.t;
	float sp = 2. * s;
	float tp = t;
	int numins = int( sp / uSize );
	int numint = int( tp / uSize );

	gl_FragColor = vColor;		// default color

	if( ( (numins+numint) % 2 ) == 0 )
	{
		if( uUseDiscard )
		{
			discard;
		}
		else
		{
			gl_FragColor = vec4( 1., 1., 1., 0. );
		}
	}

	gl_FragColor.rgb *= vLightIntensity;	// apply lighting model
}
