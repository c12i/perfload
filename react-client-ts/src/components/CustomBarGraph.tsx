import { Bar } from '@ant-design/charts'

interface Props {
    data: any
}

const CustomBarGraph: React.FC<Props> = ({ data }) => {
    const toGigabytes = (val: number) => (((val / 1073741824) * 1e3) / 1e3).toFixed(3)
    const barData = [
        {
            title: 'Total Memory',
            value: toGigabytes(data?.totalMem),
        },
        {
            title: 'Used Memory',
            value: toGigabytes(data?.usedMem),
        },
        {
            title: 'Free Memory',
            value: toGigabytes(data?.freeMem),
        },
    ]
    return (
        <Bar
            data={barData}
            legend={{ position: 'top-left' }}
            xField="value"
            yField="title"
            seriesField="value"
            autoFit
        />
    )
}

export default CustomBarGraph
