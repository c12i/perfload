import { Gauge } from '@ant-design/charts'

interface Props {
  percent: number
}

const CustomGauge: React.FC<Props> = ({ percent }) => {
  const config = {
    percent: percent / 100,
    range: {
      ticks: [0, 1 / 3, 2 / 3, 1],
      color: ['#30BF78', '#FAAD14', '#F4664A'],
    },
    indicator: {
      pointer: { style: { stroke: '#D0D0D0' } },
      pin: { style: { stroke: '#D0D0D0' } },
    },
    statistic: {
      content: {
        style: {
          fontSize: '36px',
          lineHeight: '36px',
        },
      },
    },
  }
  return <Gauge {...config} />
}

export default CustomGauge
