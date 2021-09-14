import { Badge, Card, Descriptions, Tag } from 'antd'
import dayjs from 'dayjs'
import Duration from 'dayjs/plugin/duration'
import RelativeTime from 'dayjs/plugin/relativeTime'
import Gauge from './CustomGauge'
import Bar from './CustomBarGraph'

dayjs.extend(Duration)
dayjs.extend(RelativeTime)

interface Props {
    data?: any
}

const Widget: React.FC<Props> = ({ data }) => {
    return (
        <Badge.Ribbon text={`${data?.osType} Machine`}>
            <Card style={{ width: 900 }}>
                <Card.Grid hoverable={false} style={{ width: '45%' }}>
                    <h3>CPU Load</h3>
                    <Gauge percent={data?.cpuLoad} />
                    <SystemDescriptions data={data} />
                </Card.Grid>
                <Card.Grid hoverable={false} style={{width: '55%'}}>
                    <h3>Memory Usage</h3>
                    <Bar data={data} />
                </Card.Grid>
            </Card>
        </Badge.Ribbon>
    )
}

const SystemDescriptions: React.FC<Props> = ({ data }) => {
    return (
        <Descriptions title="CPU Info" layout="vertical">
            <Descriptions.Item label={<strong>CPU Model</strong>}>
                {data?.cpuModel}
            </Descriptions.Item>
            <Descriptions.Item label={<strong>Speed</strong>}>
                {data?.cpuSpeed}
            </Descriptions.Item>
            <Descriptions.Item label={<strong>Cores</strong>}>
                {data?.cpuCoreCount}
            </Descriptions.Item>
            <Descriptions.Item label={<strong>Uptime</strong>}>
                {dayjs.duration(data?.uptime, 'seconds').humanize()}
            </Descriptions.Item>
            <Descriptions.Item label={<strong>Operating System</strong>}>
                {data?.osType}
            </Descriptions.Item>
            <Descriptions.Item label={<strong>Device Status</strong>}>
                {data?.isOnline ? (
                    <Tag color="success">Online</Tag>
                ) : (
                    <Tag color="default">Offline</Tag>
                )}
            </Descriptions.Item>
        </Descriptions>
    )
}

export default Widget
