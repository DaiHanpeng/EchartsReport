app.title = '多 Y 轴示例';

var colors = ['#5793f3', '#d14a61', '#675bba'];

option = {
    color: colors,

    tooltip: {
        trigger: 'axis'
    },
    grid: {
        right: '20%'
    },
    toolbox: {
        feature: {
            dataView: {show: true, readOnly: false},
            restore: {show: true},
            saveAsImage: {show: true}
        }
    },
    legend: {
        data:['Inlab','Result','TAT']
    },
    xAxis: [
        {
            type: 'category',
            axisTick: {
                alignWithLabel: true
            },
            data: ['6','7','8','9','10','11','12','13','14','15','16','17','18','19','20']
        }
    ],
    yAxis: [
        {
            type: 'value',
            name: 'Inlab',
            //min: 0,
            //max: 250,
            position: 'right',
            axisLine: {
                lineStyle: {
                    color: colors[0]
                }
            },
            axisLabel: {
                formatter: '{value} tubes'
            }
        },
        {
            type: 'value',
            name: 'Result',
            //min: 0,
            //max: 250,
            position: 'right',
            offset: 50,
            axisLine: {
                lineStyle: {
                    color: colors[1]
                }
            },
            axisLabel: {
                formatter: '{value} tubes'
            }
        },
        {
            type: 'value',
            name: 'TAT',
            //min: 0,
            //max: 25,
            position: 'left',
            axisLine: {
                lineStyle: {
                    color: colors[2]
                }
            },
            axisLabel: {
                formatter: '{value} minutes'
            }
        }
    ],
    series: [
        {
            name:'Inlab',
            type:'bar',
            data:[]
        },
        {
            name:'Result',
            type:'bar',
            yAxisIndex: 1,
            data:[]
        },
        {
            name:'TAT',
            type:'line',
            yAxisIndex: 2,
            data:[]
        }
    ]
};
