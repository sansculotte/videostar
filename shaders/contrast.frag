// contrast stretching 
// http://stackoverflow.com/questions/944713/help-with-pixel-shader-effect-for-brightness-and-contrast
// adapted to RGB float
// and Gem/src/Pixes/pix_contrast.cpp
// u@sansculotte.net 112011

#extension GL_EXT_gpu_shader4 : enable

#define PIX // use Gem/pix_contrasts algorithm

uniform sampler2D texture1;
uniform float contrast;
uniform float saturation; // this would be "brighness" for the simple alogrithm

// magic numbers
const float ur = -0.1484375;
const float ug = -0.2890625; 
const float ub = 0.4375;

const float yr = 0.2578125;
const float yg = 0.50390625;
const float yb = 0.09765625;

const float vr = 0.4375;
const float vg = -0.3671875;
const float vb = -0.0703125;

const float rgby = 1.1640625;
const float rv = 1.59765625;
const float gu = -0.390625;
const float gv = -0.8125;
const float bu = 2.015625;

void main (void) {

   vec2 texcoord = (gl_TextureMatrix[0] * gl_TexCoord[0]).st;
   vec4 color    = texture2D(texture1, texcoord);
   vec3 fragCol  = color.rgb;

#ifdef PIX
   float y = (color.r * yr + color.g * yg + color.b * yb) - 0.5;
   float u = color.r * ur + color.g * ug + color.b * ub;
   float v = color.r * vr + color.g * vg + color.b * vb;

   y = y * contrast + 0.5;
   u = u * saturation;
   v = v * saturation;

   fragCol.r = clamp(y * rgby + u + v * rv, 0., 1.);
   fragCol.g = clamp(y * rgby + u * gu + v * gv, 0., 1.);
   fragCol.b = clamp(y * rgby + u * bu, 0., 1.);
#else
   fragCol *= saturation;
   fragCol = ((fragCol - 0.5) * max(contrast, 0)) + 0.5;
#endif

   gl_FragColor = vec4(fragCol, color.a);

}
