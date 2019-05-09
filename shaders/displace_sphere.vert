/*************************************
 *
 * displace z by brightness
 */
#version 130

out vec2 texcoord;

uniform sampler2D tex0;
uniform float push = 1.0;

out vec4 C;

void main()
{

    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).st;
    
    vec4 pos = vec4(gl_Vertex);
    vec4 color = texture2D(tex0, texcoord);

    float Y = 0.33 * color.r + 0.5 * color.g + 0.16 * color.b;

    pos += vec4(vec4(gl_Normal, Y) * color * push);

    C = vec4(Y);
    gl_Position = gl_ModelViewProjectionMatrix * pos;
}
