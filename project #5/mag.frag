#version 330 compatibility

uniform float uScenter;
uniform float uTcenter;
uniform float uDs;
uniform float uDt;
uniform float uR;
uniform float uMagFactor;
uniform float uSharpFactor;
uniform float uRotAngle;
uniform bool  uCircle;
uniform sampler2D uImageUnit;

in vec2  vST;

void
sharpening(ivec2 ires, vec3 irgb, float ResS, float ResT, vec2 uST){
	vec2 stp0 = vec2(1./ResS, 0. );
	vec2 st0p = vec2(0. , 1./ResT);
	vec2 stpp = vec2(1./ResS, 1./ResT);
	vec2 stpm = vec2(1./ResS, -1./ResT);
	vec3 i00 = texture2D( uImageUnit, uST ).rgb;
	vec3 im1m1 = texture2D( uImageUnit, uST-stpp ).rgb;
	vec3 ip1p1 = texture2D( uImageUnit, uST+stpp ).rgb;
	vec3 im1p1 = texture2D( uImageUnit, uST-stpm ).rgb;
	vec3 ip1m1 = texture2D( uImageUnit, uST+stpm ).rgb;
	vec3 im10 = texture2D( uImageUnit, uST-stp0 ).rgb;
	vec3 ip10 = texture2D( uImageUnit, uST+stp0 ).rgb;
	vec3 i0m1 = texture2D( uImageUnit, uST-st0p ).rgb;
	vec3 i0p1 = texture2D( uImageUnit, uST+st0p ).rgb;
	vec3 target = vec3(0.,0.,0.);
	target += 1.*(im1m1+ip1m1+ip1p1+im1p1);
	target += 2.*(im10+ip10+i0m1+i0p1);
	target += 4.*(i00);
	target /= 16.;
	gl_FragColor = vec4( mix( target, irgb, uSharpFactor ), 1. );
}

void
main( )
{
		ivec2 ires = textureSize( uImageUnit, 0);
		vec3 irgb = texture2D( uImageUnit, vST ).rgb;
		float ResS = float( ires.s );
		float ResT = float( ires.t );

		vec2 uST = vST.st;

		uST.s -= uScenter;
		uST.t -= uTcenter;
		uST.s /= uMagFactor;
		uST.t /= uMagFactor;
		uST.s += uScenter;
		uST.t += uTcenter;

		uST.s = uST.s*cos(uRotAngle) - uST.t*sin(uRotAngle);
		uST.t = uST.s*sin(uRotAngle) + uST.t*cos(uRotAngle);


		if(!uCircle && uScenter + uDs >= vST.s && uScenter - uDs <= vST.s && uTcenter + uDt >= vST.t && uTcenter - uDt <= vST.t)
		{
			vec3 irgb = texture2D( uImageUnit, uST ).rgb;
			sharpening(ires, irgb, ResS, ResT, uST);
		}


		else if( uCircle && (pow(vST.s-uScenter, 2) + pow(vST.t-uTcenter, 2)) < pow(uR,2))
		{
			vec3 irgb = texture2D( uImageUnit, uST ).rgb;
			sharpening(ires, irgb, ResS, ResT, uST);
		}


		else
			gl_FragColor = vec4(irgb, 1.);

}
