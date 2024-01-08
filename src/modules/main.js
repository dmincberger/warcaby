const GameObject = {

    render() {

        console.log("render")

        requestAnimationFrame(GameObject.render);

    }


}
export { GameObject }