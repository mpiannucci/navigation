import { StateNavigator } from 'navigation';
import * as React from 'react';
import { Motion, TransitionMotion } from 'react-motion';
import { View } from 'react-native';

class NavigationMotion extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onNavigate = this.onNavigate.bind(this);
        this.state = {scenes: {}, oldSharedElements: {}, sharedElements: {}};
    }
    static contextTypes = {
        stateNavigator: React.PropTypes.object
    }
    static childContextTypes = {
        registerSharedElement: React.PropTypes.func
    }
    getChildContext() {
        return {registerSharedElement: this.registerSharedElement};
    }
    getStateNavigator() {
        return this.props.stateNavigator || this.context.stateNavigator;
    }
    componentDidMount() {
        var stateNavigator = this.getStateNavigator();
        stateNavigator.onNavigate(this.onNavigate);
        var {startStateKey, startNavigationData} = this.props;
        if (startStateKey) {
            stateNavigator.stateContext.clear();
            stateNavigator.navigate(startStateKey, startNavigationData);
        }
    }
    componentWillUnmount() {
        this.getStateNavigator().offNavigate(this.onNavigate);
    }
    registerSharedElement(key, component, element) {
        var oldSharedElement = this.state.oldSharedElements[key] || {};
        var sharedElement = {component, element};
        Promise.all([this.measure(oldSharedElement.component), this.measure(component)])
            .then(([oldMeasurements, measurements]) => {
                this.setState(({oldSharedElements, sharedElements: prevSharedElements}) => {
                    oldSharedElement.measurements = oldMeasurements;
                    if (oldMeasurements)
                        sharedElement = {component, element: React.cloneElement(element), measurements};
                    return {...prevSharedElements, key: sharedElement};
                });
            });
    }
    measure(component) {
        return new Promise(res => {
            if (!component) res(null);
            component.measure((ox, oy, w, h, x, y) => {
                res({w, h, x, y});
            });
        });
    }
    onNavigate(oldState, state, data) {
        this.setState(({scenes: prevScenes, sharedElements}) => {
            var scenes = {...prevScenes};
            var {url} = this.getStateNavigator().stateContext;
            var element = state.renderScene(this.getSceneData(data, url, prevScenes), this.moveScene(url));
            scenes[url] = {...scenes[url], element};
            return {scenes, oldSharedElements: sharedElements, sharedElements: {}};
        });
    }
    moveScene(url) {
        return data => {
            this.setState(prevState => {
                var scenes = {...prevState.scenes};
                scenes[url] = {...scenes[url], data};
                return {scenes};
            });
        };
    }
    clearScene(url) {
        this.setState(prevState => {
            var scenes = {...prevState.scenes};
            delete scenes[url];
            return {scenes};
        });
    }
    getScenes(){
        var {crumbs, nextCrumb} = this.getStateNavigator().stateContext;
        return crumbs.concat(nextCrumb).map(({state, data, url}) => (
            {state, data, url, scene: this.state.scenes[url], mount: url === nextCrumb.url}
        ));
    }
    getSceneData(data, url, prevState) {
        var scene = (prevState || this.state.scenes)[url];
        return {...data, ...(scene && scene.data)};
    }
    getStyle(styleProp, {state, data, url}, strip = false) {
        var style = typeof styleProp === 'function' ? styleProp(state, this.getSceneData(data, url)) : styleProp;
        var newStyle = {};
        for(var key in style) {
            newStyle[key] = (!strip || typeof style[key] === 'number') ? style[key] : style[key].val;
        }
        return newStyle;
    }
    render() {
        var {unmountedStyle, mountedStyle, crumbStyle, style, children} = this.props;
        return (this.getStateNavigator().stateContext.state &&
            <TransitionMotion
                willEnter={({data: sceneContext}) => this.getStyle(unmountedStyle, sceneContext, true)}
                willLeave={({data: sceneContext}) => this.getStyle(unmountedStyle, sceneContext)}
                didLeave={({data: sceneContext}) => {this.clearScene(sceneContext.url)}}
                styles={this.getScenes().map(({mount, ...sceneContext}) => ({
                    key: sceneContext.url,
                    data: sceneContext,
                    style: this.getStyle(mount ? mountedStyle : crumbStyle, sceneContext)
                }))}>
                {tweenStyles => (
                    <View style={style}>
                        {tweenStyles.map(({key, data: {scene, state, data, url}, style}) => (
                            children(style, scene && scene.element, key, state, this.getSceneData(data, url))
                        ))}
                    </View>
                )}
            </TransitionMotion>
        );
    }
}

export default NavigationMotion;
