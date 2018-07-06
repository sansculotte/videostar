// hard light and overlay texture blend as seen on:
// http://www.linuxtopia.org/online_books/graphics_tools/gimp_user_manual/en/glossary.html
// adapted to 0..1 floats
// everything else is quite straightforward anyway
// u@sansculotte.net 072011
//
#version 130
//#extension GL_ARB_texture_rectangle : enable
//#extension GL_EXT_gpu_shader4 : enable

uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D tex0;

uniform int blendMode;
uniform int effect;
uniform float push;
uniform float alpha = 1.0;
uniform float fade = 1.0;
// 0 off (show first texture only)
// 1 alphaBlend
// 2 add
// 3 multiply
// 4 hard light
// 5 overlay
// 6 difference

in vec2 texcoord1;

vec4 hardLight(vec4 t1, vec4 t2) {
    return vec4(t2.r>0.5 ? (1.0 - (1.0 - t1.r) * (1.0 - (2.0 * (t2.r - 0.5)))) : t1.r * t2.r * 2.0
              , t2.g>0.5 ? (1.0 - (1.0 - t1.g) * (1.0 - (2.0 * (t2.g - 0.5)))) : t1.g * t2.g * 2.0
              , t2.b>0.5 ? (1.0 - (1.0 - t1.b) * (1.0 - (2.0 * (t2.b - 0.5)))) : t1.b * t2.b * 2.0
              , t1.a);
}

vec4 alphaBlend(vec4 t1, vec4 t2) {
    vec3 mixrgb = vec3(mix(t1, t2, t2.a));
    return vec4(mixrgb, 1.0);
}

//
// entry point
//
void main( void )
{
    vec2 texCoord;
    vec4 mixedColor;
    float tex2col, xpush;
    switch(effect) {
        case 1: // BLIP_HORZ
            tex2col = dot(texture2D(texture2, texcoord1), vec4(0.25));
            texCoord = vec2(sin(texcoord1.s - 0.5 + tex2col * push), texcoord1.t);
            break;
        case 2: // BLIP_VERT
            tex2col = dot(texture2D(texture2, texcoord1), vec4(0.25));
            texCoord = vec2(texcoord1.s, texcoord1.t - 0.5 + tex2col * push);
            break;
        case 3: // Q_BLIP_HORZ
            tex2col = dot(texture2D(texture2, texcoord1), vec4(push));
            texCoord = vec2(texcoord1.s * tex2col, texcoord1.t);
            break;
        case 4: // Q_BLIP_VERT
            tex2col = dot(texture2D(texture2, texcoord1), vec4(push));
            texCoord = vec2(texcoord1.s, texcoord1.t * tex2col);
            break;
        case 5: // CHEAP_SYMMETRY
            texCoord = abs(texcoord1 - vec2(0.5)) + vec2(0.5) * push;
            break;
        case 6: // CTEX_SCALE
            xpush = pow((1. - push) + 1., 2);
            texCoord = vec2(texcoord1.s * xpush - (xpush * 0.5 - 0.5), texcoord1.t * xpush - (xpush * 0.5 - 0.5));
            break;
        case 7: // Q_BLIP_CENTER_HORZ
            xpush = pow((1. - push) + 1., 2);
            texCoord = vec2(texcoord1.s * xpush - (xpush * 0.5 - 0.5), texcoord1.t);
            break;
/*
        case 8: // Q_BLIP_CENTER_VERT
            xpush = clamp(1. - push, 0., 1.);
            texCoord = vec2(texcoord1.s,  texcoord1.t * xpush - (xpush * 0.5 - 0.5));
            break;
*/

        default:
            texCoord = texcoord1;
    }

    vec4 tex1 = texture2D(texture1, texCoord);
    vec4 tex2 = texture2D(texture2, texCoord);

    if(alpha < 1) {
        tex2.a = alpha;
    }

    if(effect > 0) {
        vec4 tex1 = texture2D(texture1, texCoord);
        vec4 tex2 = vec4(dot(texture2D(texture2, texCoord), vec4(0.25)));
    }

   switch(blendMode) {
      case 1: // alpha blend
         mixedColor = alphaBlend(tex1, tex2);
         break;
      case 2:
         mixedColor = tex1 + tex2 * alpha;
         break;
      case 3:
         mixedColor = tex1 * tex2;
         break;
      case 4:
         mixedColor = hardLight(tex1, tex2);
         break;
      case 5:
         //mixedColor = overlay(tex1, tex2);
         mixedColor = tex1 * ((2.0 * tex2 *(1.0 - tex1)) + tex1);
         break;
      case 6:
         mixedColor = tex1 - tex2;
         break;
      default: // ignore second tecture
         mixedColor = tex1;
   }

   gl_FragColor = mixedColor * vec4(fade);

}
