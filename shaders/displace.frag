#version 130

in vec4 C;
in vec2 texcoord;
out vec4 pixels;

/* boost brighness */
uniform bool boost = true;
/* make darkness transparent */
uniform bool black = true;

void main (void)
{
    vec4 color = C;
    if (boost) {
        color = pow(C, vec4(2));
    }
    if (black) {
        float Y = 0.33 * color.r + 0.5 * color.g + 0.16 * color.b;
        color.a = Y > 0.25 ? Y : 0.;
    }
	pixels = color;
}
