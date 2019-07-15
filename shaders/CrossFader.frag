// hard light and overlay texture blend as seen on:
// http://www.linuxtopia.org/online_books/graphics_tools/gimp_user_manual/en/glossary.html
// adapted to 0..1 floats
// everything else is quite straightforward anyway
// u@sansculotte.net 072011

uniform sampler2D texture3;
uniform sampler2D texture4;

uniform int blendMode;
uniform double mixFactor;
// 0 off (show first texture only)
// 1 alphaBlend
// 2 add
// 3 multiply
// 4 hard light
// 5 overlay

varying vec2 texcoord1;
varying vec2 texcoord2;

vec4 hardLight(vec4 t1, vec4 t2)
{
   return vec4(
      t2.r>0.5 ? (1.0 - (1.0 - t1.r) * (1.0 - (2.0 * (t2.r - 0.5)))) : t1.r * t2.r * 2.0,
      t2.g>0.5 ? (1.0 - (1.0 - t1.g) * (1.0 - (2.0 * (t2.g - 0.5)))) : t1.g * t2.g * 2.0,
      t2.b>0.5 ? (1.0 - (1.0 - t1.b) * (1.0 - (2.0 * (t2.b - 0.5)))) : t1.b * t2.b * 2.0,
      t1.a
   );
}

vec4 alphaBlend(vec4 t1, vec4 t2, float m)
{
   vec3 mixrgb = vec3(mix(t1, t2, m));
   return vec4(mixrgb, 1.0);
}

/*
vec4 overlay(vec4 t1, vec4 t2) {
   return vec4(
     // R = B × (B + (2 × T × (255 - B)) ÷ 255) ÷ 255
   );
}*/

//
// entry point
//
void main( void )
{
    vec4 mixedColor;

	vec4 tex1 = texture2D(texture3, texcoord1);
	vec4 tex2 = texture2D(texture4, texcoord2);

    switch(blendMode) {
        case 1: // alpha blend
            mixedColor = alphaBlend(tex1, tex2, mixFactor);
            break;
        case 2:
            mixedColor = tex1 + tex2;
            break;
        case 3:
            mixedColor = tex1 * tex2;
            break;
        case 4:
            mixedColor = hardLight(tex1, tex2);
            break;
        case 5:
            //mixedColor = overlay(tex1, tex2);
            mixedColor = tex1 * (2.0 * tex2 * (1.0 - tex1) + tex1);
            break;
        case 6:
            mixedColor = tex1 - tex2;
            break;
        default: // ignore second tecture
            mixedColor = tex1;
    }

    gl_FragColor = mixedColor;
}
