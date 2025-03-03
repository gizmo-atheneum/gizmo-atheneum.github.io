namespace("gizmo-atheneum.namespaces.react.Tabs",{},() => {
    const buildTab = function(tab, onFocusGetter) {
        const setOnBlurGetter = (getter) => {
            tab.onBlurGetter = getter;
        }
        const { TemplateClass } = tab;
        return <TemplateClass onFocusGetter={onFocusGetter} setOnBlurGetter={setOnBlurGetter}/>
    }
    const defaults = {
        buttonGroupClass:"",
        buttonGroupStyle:{},
        buttonClass:"",
        buttonStyle:{},
        activeButtonClass:"",
        activeButtonStyle:{},
        inactiveButtonClass:"",
        inactiveButtonStyle:{}
    }
    return class extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                selectedIndex: props.initIndex || 0,
            };
            this.tabs = props.tabs;
            this.onFocusGetter = props.onFocusGetter;
            this.onBlur = props.onBlur;
            Object.entries(props.configs).forEach(([key,value]) => {
                this[key] = value || defaults[key];
            });
        }
        switchTabs(fromIndex,toIndex) {
            const { onBlurGetter } = this.tabs[fromIndex];
            this.onBlur(onBlurGetter());
            this.setState({ selectedIndex: toIndex });
        }
        render() { 
            return <>
                <div className={this.buttonGroupClass} style={this.buttonGroupStyle}>
                    {this.tabs.map((tab, index) => {
                        const mapCopy = (out,[k,v]) => {
                            out[k] = v;
                            return out;
                        };
                        const mapReduce = (out,map) => {
                            return Object.entries(map).reduce(mapCopy,out);
                        }
                        const style = [(this.buttonStyle || {}),index === this.state.selectedIndex?(this.activeButtonStyle || {}):(this.inactiveButtonStyle || {})].reduce(mapReduce,{});
                        return <button 
                            className={`${this.buttonClass} ${index === this.state.selectedIndex?this.activeButtonClass:this.inactiveButtonClass}`} 
                            style={style}
                            onClick={() => {
                                if (index !== this.state.selectedIndex) {
                                    this.switchTabs(this.state.selectedIndex,index);
                                }
                            }}
                        >{tab.label}</button>
                    })}
                </div>
                { buildTab(this.tabs[this.state.selectedIndex],this.onFocusGetter) }
            </>;
        }
    }
});
