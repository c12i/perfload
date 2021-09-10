import { Badge, Card, Descriptions } from 'antd'
import Gauge from './CustomGauge'

interface Props {
  data?: any
}

const Widget = ({ data }: Props) => {
  return (
    <Badge.Ribbon text={`${data?.osType} Machine`}>
      <Card style={{ width: 900 }}>
        <Card.Grid hoverable={false} style={{ width: '40%' }}>
          <h3>CPU Load</h3>
          <Gauge percent={data?.cpuLoad} />
          <Descriptions title="CPU Info" layout="vertical">
            <Descriptions.Item label="Model">{data?.cpuModel}</Descriptions.Item>
            <Descriptions.Item label="Speed">{data?.cpuSpeed}</Descriptions.Item>
            <Descriptions.Item label="Cores">{data?.cpuCoreCount}</Descriptions.Item>
          </Descriptions>
        </Card.Grid>
      </Card>
    </Badge.Ribbon>
  )
}

export default Widget
