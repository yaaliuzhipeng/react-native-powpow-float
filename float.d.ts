declare namespace TornadorFloat {
  enum Status {
    created = 1,
    destroyed,
  }
  type Float = {
    key: string;
    component?: any; //(props: any) => JSX.Element | React.NamedExoticComponent<object>;
    name?: string; // equals to key when nil
    payload?: any; // data injected to component
    dependOn?: string; // use float's key
    dependRequired?: boolean; //set to true if depended by other float
    queue?: string; // queue group name
  };
  function uuid(): string;

  class FloatManager {
    public floats: Array<Float>;
    public depends: any;
    public status: any;
    /**
     *  {
     *      'toast': { queueing: false, floats: [] }
     *  }
     */
    public queues: any;

    getFloatWithKey(key: string): [number, Float];
    getFloatWithName(name: string): [number, Float];
    removeFloat(key: string): [number, Array<Float>];
    addFloat(float: Float): [boolean, Array<Float>];
  }
}
declare namespace Tornador {
  export namespace Float {}
}

declare function makeFloat(float: TornadorFloat.Float, rm?: boolean);