import {CesiumController} from './CesiumController.ts'
import * as Cesium from 'cesium'

export class CustomPrimitive extends CesiumController {
    viewer : Cesium.Viewer
    constructor(){
        super()
        this.viewer = this.getViewer()
    }
    

}