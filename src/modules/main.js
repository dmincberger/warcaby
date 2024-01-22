import { Scene } from 'three';
import Renderer from './renderer';
import Camera from './camera';
const container = document.getElementById('root')
const scene = new Scene()
const renderer = new Renderer(scene, container)
const camera = new Camera(renderer.threeRenderer)

const GameObject = {

    render() {

        console.log("render")
        renderer.render(scene, camera.threeCamera);

        requestAnimationFrame(GameObject.render);

    }


}
export { GameObject, scene }