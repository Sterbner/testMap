import {CesiumController} from '../class/CesiumController'
let cesiumController:CesiumController


function initBean() {
    cesiumController = new CesiumController()
}

export {initBean,cesiumController}