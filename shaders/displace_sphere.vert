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

    float Y = vec3(0.33 * color.r + 0.5 * color.g + 0.16 * color.b);

    pos += gl_Normal * color * push;

    C = Y;
    gl_Position = gl_ModelViewProjectionMatrix * pos;
}
