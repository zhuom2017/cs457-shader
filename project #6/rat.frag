#version 330 compatibility

in vec3 vRefractVector;
in vec3 vReflectVector;
in vec3 eyeDir;
uniform sampler3D Noise3;

uniform float uMix;
uniform samplerCube uReflectUnit;
uniform samplerCube uRefractUnit;

const vec4 WHITE = vec4( 1.,1.,1.,1. );

vec3
RotateNormal( float angx, float angy, vec3 n )
{
        float cx = cos( angx );
        float sx = sin( angx );
        float cy = cos( angy );
        float sy = sin( angy );

        // rotate about x:
        float yp =  n.y*cx - n.z*sx;    // y'
        n.z      =  n.y*sx + n.z*cx;    // z'
        n.y      =  yp;
        // n.x      =  n.x;

        // rotate about y:
        float xp =  n.x*cy + n.z*sy;    // x'
        n.z      = -n.x*sy + n.z*cy;    // z'
        n.x      =  xp;
        // n.y      =  n.y;

        return normalize( n );
}


void main( )
{
    vec4 refractcolor = textureCube( uRefractUnit, vRefractVector );
    vec4 reflectcolor = textureCube( uReflectUnit, vReflectVector );
    refractcolor = mix( refractcolor, WHITE, .40 );
    gl_FragColor = vec4( mix( refractcolor, reflectcolor, uMix ).rgb, 1. );
}
