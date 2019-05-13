/*************************************
 *
 * displace z by brightness
 */
#version 130

out vec2 texcoord;
out vec4 C;

uniform sampler2D tex0;
uniform float push = 1.0;


void main()
{
    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).st;
    
    vec4 color = texture2D(tex0, texcoord);
    float intensity = 0.33 * color.r + 0.5 * color.g + 0.16 * color.b;

    vec3 pos = gl_Vertex.xyz * color.rgb * push;

    C = color;
    gl_Position = gl_ModelViewProjectionMatrix * vec4(pos, 1.);
}
