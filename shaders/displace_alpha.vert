#version 120
#extension GL_ARB_texture_rectangle : enable
#extension GL_EXT_gpu_shader4 : enable

uniform sampler2DRect tex0;
//uniform bool alpha;
varying vec2 texcoord;

void main()
{

    vec4 pos   = gl_Vertex;
    // there's weird artifacts in the corner. shorten range
    texcoord   = 0.98 * (gl_TextureMatrix[0] * gl_MultiTexCoord0).st;
    vec4 color = texture2DRect(tex0, texcoord);
//    random fract(sin(dot(vec2(2.23, 5.552352) ,vec2(12.9898,78.233))) * 43758.5453);

    //	v.z = color.r;
    //	v.x += (color.b-0.5)/2.;
    //	v.y += (color.g-0.5)/2.;
    pos += (vec4(gl_Normal, 1.0) * color);
    //   if(alpha) pos.w = 1.0;

    gl_Position = gl_ModelViewProjectionMatrix * pos * 20;

}
