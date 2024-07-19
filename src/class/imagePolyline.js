/**
 *
 * @param position [ 第1个点的longtitude，第1个点的lattitude，
 *                   第2个点的longtitude，第2个点的lattitude] 类推
 */
export function imagePolyline(viewer, position) {
  let Cesium = Prism.Cesium
  const polylineDynamicFabric = {
    type: 'polylineDynamicFabric',
    uniforms: {
      color: Cesium.Color.GREEN,
      image: '/roadTexture1.png',
      imageWd: 10, //控制纹理的长度
      speed: 3,
    },
    source: /* glsl */ `
    uniform float imageWd;
    uniform vec4 colors;
          in float v_polylineAngle;
    mat2 rotate(float rad) {
      float c = cos(rad);
      float s = sin(rad);
      return mat2(
          c, s,
          -s, c
      );
    }
    czm_material czm_getMaterial(czm_materialInput materialInput)
    {
        czm_material material = czm_getDefaultMaterial(materialInput);
        vec2 st = materialInput.st;
        vec2 pos = rotate(v_polylineAngle) * gl_FragCoord.xy;
        float s = pos.x / (imageWd * czm_pixelRatio);
        // float s = st.s/ (abs(fwidth(st.s)) * imageW * czm_pixelRatio);
        //s = s-time;//增加运动效果
        float t = st.t;
        vec4 colorImage = texture(image, vec2(fract((s - speed * czm_frameNumber * 0.005)), t));
      
        material.diffuse = colorImage.rgb; 
        // material.diffuse = color.rgb;
        material.alpha = colorImage.a; 
        // material.emission = vec3(1,1,0)
        return material;
    }`,
  }

  const polylineinstance = new Cesium.GeometryInstance({
    geometry: new Cesium.GroundPolylineGeometry({
      positions: Cesium.Cartesian3.fromDegreesArray(position),
      width: 8,
    }),
  })

  const polyline = new Cesium.GroundPolylinePrimitive({
    geometryInstances: polylineinstance,
    appearance: new Cesium.MaterialAppearance({
      material: new Cesium.Material({
        fabric: polylineDynamicFabric,
      }),
    }),
  })

  const primitivesCollection = new Cesium.PrimitiveCollection()
  viewer.scene.primitives.add(polyline)
  // console.log(polyline);

  // primitivesCollection.add(polyline)
  // setTimeout(() => {
  //   viewer.scene.primitives.remove(polyline)
  // }, 5000)

  return polyline
}
