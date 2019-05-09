/*************************************
 *
 * displace z by brightness
 */
#version 130

uniform sampler2D tex0;
uniform float push = 1.0;

in vec4 mcVertex;
in vec3 mcBiNormal;

out vec2 texcoord;
out vec4 C;

void main()
{
    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).st;
    
    vec4 color = texture2D(tex0, texcoord);
    float intensity = 0.33 * color.r + 0.5 * color.g + 0.16 * color.b;

    vec4 pos = mcVertex + vec4(mcBiNormal, intensity) * intensity * push * -1.0;

    C = color;
    gl_Position = gl_ModelViewProjectionMatrix * pos;
}
