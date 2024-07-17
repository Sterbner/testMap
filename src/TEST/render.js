import {Util} from "./util.js";
import {CustomPrimitive} from "./customPrimitive.js";
import vt1 from './vt.glsl?raw'
import mainVt from './mainVt.glsl?raw'
import common from './common.glsl?raw'
import a from './a.glsl?raw'
import b from './b.glsl?raw'
import c from './c.glsl?raw'
import d from './d.glsl?raw'
import main from './main.glsl?raw'

export default class ParticlesRendering {
    constructor(context, data, userInput, viewerParameters, particlesComputing) {

        const current = performance.now()
        // this.current = current;
        //
        // this.iTime = (performance.now() - current) / 1000.
        this.iTime = () => {
            return ((performance.now() - current) / 1000.)
        }

        this.iFrame = () => {
            if (performance.now() - current > 999) {
                return 60.
            } else {
                return 0.
            }
        }


        this.createRenderingTextures(context, data);
        this.createRenderingFramebuffers(context);
        this.createRenderingPrimitives(context, userInput, viewerParameters, particlesComputing);
    }

    createRenderingTextures(context, data) {
        const colorTextureOptions = {
            context: context,
            width: context.drawingBufferWidth,
            height: context.drawingBufferHeight,
            pixelFormat: Cesium.PixelFormat.RGBA,
            pixelDatatype: Cesium.PixelDatatype.FLOAT
        };
        const depthTextureOptions = {
            context: context,
            width: context.drawingBufferWidth,
            height: context.drawingBufferHeight,
            pixelFormat: Cesium.PixelFormat.DEPTH_COMPONENT,
            pixelDatatype: Cesium.PixelDatatype.UNSIGNED_INT
        };

        this.textures = {
            bufferAColor: Util.createTexture(colorTextureOptions),
            nextBufferAColor: Util.createTexture(colorTextureOptions),
            bufferBColor: Util.createTexture(colorTextureOptions),
            nextBufferBColor: Util.createTexture(colorTextureOptions),
        };
    }

    createRenderingFramebuffers(context) {
        this.framebuffers = {
            bufferA: Util.createFramebuffer(context, this.textures.bufferAColor),
            nextBufferA: Util.createFramebuffer(context, this.textures.nextBufferAColor),
            bufferB: Util.createFramebuffer(context, this.textures.bufferBColor),
            nextBufferB: Util.createFramebuffer(context, this.textures.nextBufferBColor),
        }
    }

    createRenderingPrimitives() {
        const that = this;

        const geometry3 = Util.getFullscreenQuad()

        // const modelCenter = Cesium.Cartesian3.fromDegrees(112, 23, 0)
        // const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(modelCenter)

        const rectGeometry = new Cesium.RectangleGeometry({
            ellipsoid: Cesium.Ellipsoid.WGS84,
            rectangle: Cesium.Rectangle.fromDegrees(111, 22, 113, 24),
            height: Cesium.HeightReference.CLAMP_TO_GROUND
        });
        const geometry2 = Cesium.RectangleGeometry.createGeometry(rectGeometry)

        const dim = new Cesium.Cartesian3(5,5,5);

        const _geometry = Cesium.BoxGeometry.fromDimensions({

            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST,

            dimensions: dim,

        });

        const _modelMatrix = Cesium.Matrix4.multiplyByTranslation(
            Cesium.Transforms.eastNorthUpToFixedFrame(
                Cesium.Cartesian3.fromDegrees(
                    109.1, 21.785
                )
            ),

            new Cesium.Cartesian3(0.0, 0.0, 0.0),

            new Cesium.Matrix4()
        );

        const roteM = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(90))

        const modelMatrix = Cesium.Matrix4.multiplyByMatrix3(_modelMatrix, roteM, new Cesium.Matrix4)

        const geometry = Cesium.BoxGeometry.createGeometry(_geometry);

        const attributelocations = Cesium.GeometryPipeline.createAttributeLocations(geometry);


        this.primitives = {
            bufferA: new CustomPrimitive({
                commandType: 'Draw',
                // matrix: modelMatrix,
                geometry: geometry3,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                uniformMap: {
                    iTime: this.iTime,
                    iFrame: this.iFrame,
                    bufferC: () => this.framebuffers.nextBufferA.getColorTexture(0),
                    bufferD: () => this.framebuffers.nextBufferB.getColorTexture(0),
                },
                // prevent Cesium from writing depth because the depth here should be written manually
                vertexShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
                    sources: [vt1]
                }),
                fragmentShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
                    sources: [common, a]
                }),
                rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true,
                    blending: {
                        enabled: false
                    }
                }),
                framebuffer: that.framebuffers.bufferA,
            }),
            bufferB: new CustomPrimitive({
                commandType: 'Draw',
                // matrix: modelMatrix,
                geometry: geometry3,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                uniformMap: {
                    iTime: this.iTime,
                    iFrame: this.iFrame,
                    bufferA: () => this.framebuffers.bufferA.getColorTexture(0),
                    bufferD: () => this.framebuffers.nextBufferB.getColorTexture(0),
                },
                // prevent Cesium from writing depth because the depth here should be written manually
                vertexShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
                    sources: [vt1]
                }),
                fragmentShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
                    sources: [common, b]
                }),
                rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true,
                    blending: {
                        enabled: false
                    }
                }),
                framebuffer: that.framebuffers.bufferB,
            }),
            bufferC: new CustomPrimitive({
                commandType: 'Draw',
                // matrix: modelMatrix,
                geometry: geometry3,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                uniformMap: {
                    iTime: this.iTime,
                    iFrame: this.iFrame,
                    bufferA: () => this.framebuffers.bufferA.getColorTexture(0),
                    bufferB: () => this.framebuffers.bufferB.getColorTexture(0),
                },
                // prevent Cesium from writing depth because the depth here should be written manually
                vertexShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
                    sources: [vt1]
                }),
                fragmentShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
                    sources: [common, c]
                }),
                rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true,
                    blending: {
                        enabled: false
                    }
                }),
                framebuffer: that.framebuffers.nextBufferA,
            }),
            bufferD: new CustomPrimitive({
                commandType: 'Draw',
                // matrix: modelMatrix,
                geometry: geometry3,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                uniformMap: {
                    iTime: this.iTime,
                    iFrame: this.iFrame,
                    bufferC: () => this.framebuffers.nextBufferA.getColorTexture(0),
                    bufferB: () => this.framebuffers.bufferB.getColorTexture(0),
                },
                // prevent Cesium from writing depth because the depth here should be written manually
                vertexShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
                    sources: [vt1]
                }),
                fragmentShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
                    sources: [common, d]
                }),
                rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true,
                    blending: {
                        enabled: false
                    }
                }),
                framebuffer: that.framebuffers.nextBufferB,
            }),
            main: new CustomPrimitive({
                commandType: 'Draw',
                matrix: modelMatrix,
                geometry: geometry,
                primitiveType: Cesium.PrimitiveType.TRIANGLES,
                uniformMap: {
                    iTime: this.iTime,
                    bufferC: () => this.framebuffers.nextBufferA.getColorTexture(0),
                },
                // prevent Cesium from writing depth because the depth here should be written manually
                vertexShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_GL_POSITION_LOG_DEPTH'],
                    sources: [mainVt]
                }),
                fragmentShaderSource: new Cesium.ShaderSource({
                    defines: ['DISABLE_LOG_DEPTH_FRAGMENT_WRITE'],
                    sources: [common, main]
                }),
                rawRenderState: Util.createRawRenderState({
                    viewport: undefined,
                    depthTest: {
                        enabled: false,
                        func: Cesium.DepthFunction.ALWAYS // always pass depth test for full control of depth information
                    },
                    depthMask: true,
                    blending: {
                        enabled: true
                    }
                }),
                framebuffer: undefined,
                // autoClear: true,
            })
        };
    }
}
