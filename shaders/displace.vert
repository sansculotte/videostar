/*************************************
 *
 * displace z by brightness
 */
#version 130

uniform sampler2D tex0;
uniform float push = 1.0;

out vec2 texcoord;
out vec4 C;

void main()
{

    texcoord = (gl_TextureMatrix[0] * gl_MultiTexCoord0).st;
    
    vec4 pos = vec4(gl_Vertex);
    vec4 color = texture2D(tex0, texcoord);

    pos += (vec4(gl_Normal, 1.0) * color * push);

    C = color;
    gl_Position = gl_ModelViewProjectionMatrix * pos;
}
