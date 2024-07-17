
in vec3 position;
in vec2 st;
out vec3 vOrigin;
out vec3 vDirection;

void main()
{
    vOrigin=czm_encodedCameraPositionMCHigh+czm_encodedCameraPositionMCLow;
    vDirection=position-vOrigin;
    gl_Position = czm_modelViewProjection * vec4(position,1.0);

}
