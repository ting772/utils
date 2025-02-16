import GUI from 'lil-gui';

type GuiInstance = InstanceType<typeof GUI>


type OptionType = {
  //参考 https://lil-gui.georgealways.com/#GUI#add 方法参数形式
  value: [unknown, ...unknown[]];
  isColor?: boolean;
  disable?: boolean;
  onChange?: Function;
  onFinishChange?: Function;
}

type OptionEvtType = {
  [Prop in keyof OptionType as Prop extends `on${string}` ? Prop : never]-?: OptionType[Prop]
}

type MainGuiConfig = {
  [key: string]: Function | OptionType | MainGuiConfig[]
}

export type GuiConfig = { title?: string; } | (MainGuiConfig & { title?: string; })

type Result = {
  [key: string]: unknown
}

function make(parent: GuiInstance, cfg: GuiConfig | MainGuiConfig, obj: Result = {}, level = 0) {
  for (let key in cfg) {
    if (level == 0 && key == "title" && cfg.title) {
      parent.title(cfg.title as string);
      continue;
    }

    let v = (cfg as any)[key] as OptionType | MainGuiConfig[] | Function

    //顶层可以添加folder
    if (Array.isArray(v)) {
      if (level == 0) {
        const folder = parent.addFolder(key);
        v.forEach((item) => {
          make(folder, item, obj, level + 1);
        });
      } else {
        console.warn("only top level can add folder");
      }
      continue
    } else if (typeof v == 'function') {
      obj[key] = v
      parent.add(obj, key)
    } else {
      obj[key] = v.value[0];
      const { isColor, value, disable, ...rest } = v;
      let ctl = parent[isColor ? "addColor" : "add"](
        obj,
        key,
        ...v.value.slice(1) as any
      );

      if (disable) {
        ctl.disable(disable)
      }
      let evtname: keyof OptionEvtType
      for (evtname in rest) {
        ctl[evtname]((rest as OptionEvtType)[evtname]);
      }
    }
  }
}

/**
 * 根据配置生成lil-gui控制菜单
 * @param cfg 配置
 * @returns 
 */
export function setupLilGui(cfg: GuiConfig) {
  let obj = {} as any;
  let gui = new GUI()
  make(gui, cfg, obj);
  return {
    gui, obj, helpers: {
      getAllControllers() {
        return gui.controllersRecursive()
      },
      getControllerByKey(key: string) {
        return gui.controllersRecursive().find(item => item.property == key)
      },
    }
  };
}