in vec3 position;
in vec2 st;
out vec3 vOrigin;
out vec3 vDirection;
out vec2 vL;
out vec2 vR;
out vec2 vT;
out vec2 vB;

void main()

{
    vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
    vDirection=position-vOrigin;
    vec2 texelSize = 1.0 / czm_viewport.zw;
    vL = st - vec2(texelSize.x, 0.0);
    vR = st + vec2(texelSize.x, 0.0);
    vT = st + vec2(0.0, texelSize.y);
    vB = st - vec2(0.0, texelSize.y);
    gl_Position = vec4(position, 1.0);
}
