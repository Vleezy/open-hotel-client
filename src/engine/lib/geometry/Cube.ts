import { Vector3 } from '../isometric/Vector3'

export type CubeFaceName = 'top' | 'bottom' | 'left' | 'right' | 'front' | 'back' | string

export interface CubeOptions {
    width?: number
    height?: number
    depth?: number
    position?: Vector3
    faces?: CubeFaceName[]
    colors?: { [key in CubeFaceName]: number }
}

export type CubeFaces = {
    [k in CubeFaceName]?: [Vector3, Vector3, Vector3, Vector3]
}

export class Cube extends PIXI.Graphics {
    public $options: CubeOptions
    public $faces: CubeFaces
    public $textures: CubeFaces
    public $colors: { [k in CubeFaceName]: number } = {
        top: 0x989865,
        bottom: 0x989865,
        left: 0x838357,
        right: 0x838357,
        front: 0x6f6f49,
        back: 0x6f6f49,
    }
    public $opacity: { [k in CubeFaceName]: number } = {
        top: 1,
        bottom: 1,
        left: 1,
        right: 1,
        front: 1,
        back: 1,
    }

    get facesShape() {
        const { faces = [] } = this.$options
        const shapes: {
            [key in CubeFaceName]: PIXI.Polygon
        } = {}

        for (let f of ['back', 'bottom', 'right', 'left', 'top', 'front'].filter(f => faces.includes(f))) {
            if (f in this.$faces) {
                shapes[f] = new PIXI.Polygon(this.$faces[f].map(p => p.toVector2()))
            }
        }

        return shapes
    }

    constructor(options?: CubeOptions) {
        super()

        this.$options = {
            width: 50,
            height: 50,
            depth: 50,
            position: new Vector3(),
            faces: ['top', 'left', 'front'],
            colors: {
                top: 0x989865,
                bottom: 0x989865,
                left: 0x838357,
                right: 0x838357,
                front: 0x6f6f49,
                back: 0x6f6f49,
            },
            ...(options || {}),
        }

        const { position, width, height, depth, colors } = this.$options

        this.$colors = colors

        this.$faces = {
            top: [
                new Vector3(position.x, position.y, position.z),
                new Vector3(position.x + width, position.y, position.z),
                new Vector3(position.x + width, position.y + depth, position.z),
                new Vector3(position.x, position.y + depth, position.z),
            ],
            bottom: [
                new Vector3(position.x, position.y, position.z - height),
                new Vector3(position.x + width, position.y, position.z - height),
                new Vector3(position.x + width, position.y + depth, position.z - height),
                new Vector3(position.x, position.y + depth, position.z - height),
            ],
        }

        this.$faces.back = [this.$faces.top[0], this.$faces.top[3], this.$faces.bottom[3], this.$faces.bottom[0]]

        this.$faces.left = [this.$faces.top[2], this.$faces.top[3], this.$faces.bottom[3], this.$faces.bottom[2]]

        this.$faces.right = [this.$faces.top[0], this.$faces.top[1], this.$faces.bottom[1], this.$faces.bottom[0]]

        this.$faces.front = [this.$faces.top[1], this.$faces.top[2], this.$faces.bottom[2], this.$faces.bottom[1]]

        this.renderCube()
    }

    renderCube() {
        const { facesShape } = this

        for (let f in facesShape) {
            this.beginFill(this.$colors[f], this.$opacity[f])
            this.drawPolygon(facesShape[f])
            this.endFill()
        }
    }
}