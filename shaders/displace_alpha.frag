#version 120
#extension GL_ARB_texture_rectangle : enable
#extension GL_EXT_gpu_shader4 : enable

uniform sampler2DRect tex0;
varying vec2 texcoord;

void main (void)
{
    vec4 color = texture2DRect(tex0,  texcoord);
    //vec4 color = vec4(1.0, 0.0, 0.0, 1.0);
    //color.a = color.r * color.b * color.g;
    float Y = 0.33 * color.r + 0.5 * color.g + 0.16 * color.b;
    color.a = Y > 0.25 ? Y : 0.;
    gl_FragColor = color;
}
