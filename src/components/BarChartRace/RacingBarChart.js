import React from 'react'
import data from '../../data/processed_data.json';
import BarChart from './BarChart';
import './RacingBarChart.css';


const RacingBarChart = () => {

    console.log("RacingBarChart rendered");

   
    const randomColor = () => {
        return `rgb(${255 * Math.random()}, ${255 * Math.random()}, ${255})`
    }

    const keys = Object.keys(data);
    const colors = keys.reduce((res, item) => ({
        ...res,
        ...{ [item]: randomColor() }
    }), {});

    const labels = keys.reduce((res, item, idx) => {
        return {
            ...res,
            ...{
                [item]: (
                    <div style={{ textAlign: "center", }}>
                        <div>{item}</div>
                    </div>
                )
            }
        };
    }, {});

    const time = Array(21).fill(0).map((itm, idx) => idx + 1);

    return (
        <div className="racing-bar-chart-wrapper">
            <div className="container">
                <BarChart
                    start={true}
                    data={data}
                    timeline={time}
                    labels={labels}
                    colors={colors}
                    timeout={1000}
                    delay={200}
                    timelineStyle={{
                        textAlign: "center",
                        fontSize: "50px",
                        color: "rgb(148, 148, 148)",
                        marginBottom: "100px"
                    }}
                    textBoxStyle={{
                        textAlign: "right",
                        color: "rgb(133, 131, 131)",
                        fontSize: "30px",
                    }}
                    barStyle={{
                        height: "15px",
                        marginTop: "10px",
                        borderRadius: "10px",
                    }}
                    width={[15, 75, 10]}
                    maxItems={15}
                />
            </div>
        </div>
    );

}
export default RacingBarChart;
