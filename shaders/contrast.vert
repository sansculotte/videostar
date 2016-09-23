// pass texture coordinates to fragment shader
//

varying vec2 texcoord1;

void main()
{
    texcoord1 = (gl_TextureMatrix[0] * gl_MultiTexCoord0).st;
    //texcoord1 = gl_MultiTexCoord0.st;
    gl_Position = ftransform();
}
