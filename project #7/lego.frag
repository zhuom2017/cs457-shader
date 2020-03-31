#version 330 compatibility

uniform vec4 uColor;

in float gLightIntensity;

void
main( )
{
    gl_FragColor = vec4(vec3(uColor)*gLightIntensity,1);
}
