import React, { useState, useEffect } from 'react';
import Bar from './Bar';
import './RacingBarChart.css';

const classes = {
    barChart: {
        width: "100%",
        position: "relative",
    },
    container: {
        width: "100%",
    }
};

const BarChart = ({
    data,
    startYear,
    endYear,
    barStyle,
    maxItems: propsMaxItems,
    start,
    timeline,
    timeout,
    delay,
    colors,
    labels,
    timelineStyle,
    textBoxStyle,
    width
}) => {
    const barHeight = `calc(${barStyle.height} + ${barStyle.marginTop})`;
    const nItems = Object.keys(data).length;
    const maxItems = propsMaxItems <= nItems ? propsMaxItems : nItems;
    const barChartStyle = {
        height: `calc(${maxItems} * ${barHeight})`,
    };

    const [intervalId, setIntervalId] = useState(null);
    const [idx, setIdx] = useState(0);
    const [prevRank, setPrevRank] = useState({});
    const [currRank, setCurrRank] = useState({});
    const [maxVal, setMaxVal] = useState(0);

    
    useEffect(() => {
        const [newRank, newMaxVal] = sortAxis(idx);
        setPrevRank(currRank);
        setCurrRank(newRank);
        setMaxVal(newMaxVal);
    }, [idx]);

    const sortAxis = (i, descending = true) => {
        let toSort = Object.keys(data).map(name => {
            return {
                name,
                val: data[name][i]
            };
        });

        toSort.sort((left, right) => left.val - right.val);
        if (descending) {
            toSort.reverse();
        }

        const fItems = Object.keys(data).length;
        if (maxItems && maxItems <= fItems) {
            toSort = toSort.slice(0, maxItems);
        }

        const maxValue = Math.max(...toSort.map(item => item.val));
        const sortedRank = toSort.reduce((ret, item, index) => ({
            ...ret,
            [item.name]: index
        }), {});

        return [sortedRank, maxValue];
    };

    const update = () => {

        if (idx + 1 === timeline.length) {
            clearInterval(intervalId);
            return;
        }

        const [newRank, newMaxVal] = sortAxis(idx + 1);
        setIdx(idx + 1);
        setPrevRank(currRank);
        setCurrRank(newRank);
        setMaxVal(newMaxVal);
        console.log("This is the current idx value: ", idx);
    };

    const getInfoFromRank = name => {
        const currIdx = idx;
        const prevIdx = (currIdx > 0 ? currIdx - 1 : 0);
        const value = data[name][currIdx];
        const isHidden = (currRank[name] === undefined);
        const currStyle = {
            ...barStyle,
            marginTop: `calc(${currRank[name]} * ${barHeight})`,
            width: `${100 * data[name][currIdx] / maxVal}%`,
            backgroundColor: colors[name],
        };
        const prevStyle = {
            ...barStyle,
            marginTop: `calc(${prevRank[name]} * ${barHeight})`,
            width: `${100 * data[name][prevIdx] / maxVal}%`,
            backgroundColor: colors[name],
        };
        return [value, isHidden, currStyle, prevStyle];
    };

    return (
        <div style={classes.container}>
            <div style={timelineStyle}>
                {timeline[idx]}
            </div>
            <div style={{ ...classes.barChart, ...barChartStyle }}>
                {
                    Object.keys(data).map(name => {
                        const [value, hidden, currStyle, prevStyle] = getInfoFromRank(name);
                        if (hidden) return null;
                        return (
                            <Bar
                                key={name}
                                name={name}
                                value={value}
                                label={labels[name]}
                                currStyle={currStyle}
                                prevStyle={prevStyle}
                                timeout={timeout}
                                textBoxStyle={textBoxStyle}
                                width={width}
                            />
                        );
                    })
                }
            </div>
            <div style={{ position: 'relative', width: '100%' }}>
    <input 
        type="range" 
        min="0" 
        max={timeline.length - 1} 
        value={idx} 
        onChange={(e) => setIdx(Number(e.target.value))} 
        style={{ width: '100%' }} 
        list="year-ticks"
    />

    <div style={{ display: 'flex', justifyContent: 'space-between', position: 'absolute', width: '100%', marginTop: '20px' }}>
        {timeline.map(year => (
            <span key={year} style={{ fontSize: '10px' }}>{year}</span>
        ))}
    </div>
</div>





        </div>
    );
}

export default BarChart;