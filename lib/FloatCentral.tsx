import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import FloatToast from './components/FloatToast'

export namespace TornadorFloat {
    export enum Status {
        created = 1,
        destroyed,
    }
    export type Float = {
        key: string;
        component?: any; //(props: any) => JSX.Element | React.NamedExoticComponent<object>;
        name?: string; // equals to key when nil
        payload?: any; // data injected to component
        dependOn?: string; // use float's key
        dependRequired?: boolean; //set to true if depended by other float
        queue?: string; // queue group name
    };
    export function uuid(): string {
        return Date.now().toString(32) + Math.round(Math.random() * 1000).toString(32)
    }
    export class FloatManager {
        public floats: Array<Float> = [];
        // 存储一系列key对应float的被依赖组件;
        // 例如 depends['key1']存储的 float都是需要等 key1 浮层隐藏后才显示的浮层
        public depends: any = {};
        // 存储会被依赖的浮层的状态
        public status: any = {};
        // 队列浮层、需要依次显示的同类浮层，例如 Toast提示、应用内顶部通知条
        // 例如: { 'toast': { queueing: false, floats: [] } , 'notification': {queueing: false, floats: []} }
        public queues: any = {};

        getFloatWithKey(key: string): [number, any] {
            let i = this.floats.findIndex((v, i, _) => v.key === key)
            return [i, this.floats[i]];
        }
        getFloatWithName(name: string) {
            let i = this.floats.findIndex((v, i, _) => (v.name && v.name === name))
            return [i, this.floats[i]];
        }
        removeFloat(key: string): [number, Array<Float>] {
            let [index, delFloat] = this.getFloatWithKey(key)
            if (index != -1) {
                let float = (delFloat as Float);
                if (float.dependRequired) {
                    this.status[float.key] = Status.destroyed
                }
                this.floats.splice(index as number, 1)
                if (this.depends[float.key]) {
                    this.floats.push(this.depends[float.key])
                    delete this.status[float.key]
                    delete this.depends[float.key]
                }
                if (float.queue) {
                    let nqueue = this.queues[float.queue]
                    if (nqueue) {
                        nqueue.queueing = nqueue.floats.length > 0;
                        let nfloat = nqueue.floats.splice(0, 1)
                        this.floats = [...this.floats, ...nfloat]
                    }
                }
            }
            return [index as number, this.floats]
        }
        addFloat(float: Float): [boolean, Array<Float>] {
            if (float.key && float.component) {
                //先判断是否存在相同key
                let [index, found] = this.getFloatWithKey(float.key)
                if (index != -1) {
                    this.floats[index] = float;
                    return [true, this.floats];
                }

                if (float.dependOn) {
                    if (this.status[float.dependOn] == Status.destroyed) {
                        this.floats.push(float)
                        return [true, this.floats]
                    } else {
                        this.depends[float.dependOn] = float;
                        return [false, null]
                    }
                } else if (float.queue) {
                    let nqueue: any = this.queues[float.queue];
                    if (!nqueue) {
                        nqueue = { queueing: false, floats: [] };
                        this.queues[float.queue] = nqueue;
                    }
                    if (nqueue.queueing) {
                        nqueue.floats.push(float)
                        return [false, null]
                    } else {
                        nqueue.queueing = true;
                        this.floats.push(float)
                        return [true, this.floats]
                    }
                } else {
                    this.floats.push(float)
                    if (float.dependRequired) {
                        this.status[float.key] = Status.created;
                    }
                    return [true, this.floats]
                }
            }
            return [false, null];
        }
    }
}

const FloatCentral = React.memo((props) => {

    const manager = useRef(new TornadorFloat.FloatManager()).current;
    const [floats, setFloats] = useState([])


    function add(float: TornadorFloat.Float) {
        let [shouldUpdate, fts] = manager.addFloat(float);
        if (shouldUpdate) {
            setFloats([...fts])
        }
    }
    function remove(key: string) {
        let [index, fts] = manager.removeFloat(key)
        if (index != -1) {
            setFloats([...fts])
        }
    }
    function __makeFloat(float: TornadorFloat.Float, rm?: boolean) {
        if (rm) {
            remove(float.key);
        } else {
            add(float)
        }
    }
    function __makeToast(config: { text: string; position?: 'top' | 'center' | 'bottom'; duration?: 'short' | 'long' }) {
        global.makeFloat({
            key: TornadorFloat.uuid(),
            component: FloatToast,
            payload: {
                data: {
                    text: config.text,
                    position: config.position,
                    duration: config.duration,
                },
            },
            queue: 'TOAST',
        });
    }
    useEffect(() => {
        global.makeFloat = __makeFloat;
        global.makeToast = __makeToast;
    }, [])

    return (
        <>
            {floats.map((v: TornadorFloat.Float, i) => {
                const { component: Component, key, payload = {} } = v;
                return (
                    <Component
                        key={key}
                        {...payload}
                        removeSelf={() => { remove(key) }}
                    />
                )
            })}
        </>
    )
})
export default FloatCentral;