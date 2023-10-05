import React from 'react';
import { Transition } from 'react-transition-group';

const classes = {
    bar: {
        position: "relative",
        // margin: "100px 0"
    },
    container: {
        width: "100%",
        display: "flex",
        position: "absolute",
    }
}

const Bar = ({ 
    timeout, 
    prevStyle, 
    currStyle, 
    width, 
    label, 
    textBoxStyle, 
    value 
}) => {
    const barDefaultStyle = {
        transition: `all ${timeout}ms ease-in-out`,
        ...prevStyle,
    };

    const posDefaultStyle = {
        transition: `all ${timeout}ms ease-in-out`,
        marginTop: prevStyle.marginTop,
    };

    const barTransitionStyles = {
        entering: prevStyle,
        entered: currStyle,
        exiting: currStyle,
    };

    const posTransitionStyles = {
        entering: { marginTop: prevStyle.marginTop },
        entered: { marginTop: currStyle.marginTop },
        exiting: { marginTop: currStyle.marginTop },
    };

    return (
        <div style={classes.container}>
            <Transition in={true} timeout={timeout}>
                {state => (
                    <>
                        <div style={{
                            ...posDefaultStyle, 
                            ...posTransitionStyles[state],
                            width: `${width[0]}%`
                        }}>
                            {label}
                        </div>

                        <div style={{width: `${width[1]}%`}}>
                            <div
                                style={{
                                    ...classes.bar, 
                                    ...barDefaultStyle, 
                                    ...barTransitionStyles[state]
                                }} 
                            />
                        </div>

                        <div style={{
                            ...posDefaultStyle, 
                            ...posTransitionStyles[state],
                            width: `${width[2]}%`
                        }}>
                            <div style={{...textBoxStyle}}>
                                {value}
                            </div>
                        </div>
                    </>
                )}
            </Transition>
        </div>
    );
}

export default Bar;
