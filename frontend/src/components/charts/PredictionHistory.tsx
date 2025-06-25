import React from 'react';
import {
  List,
  Card,
  Space,
  Button,
  Typography,
  Empty,
  Tag,
  Popconfirm,
  message,
} from 'antd';
import {
  HistoryOutlined,
  DeleteOutlined,
  ClearOutlined,
  ReloadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';

const { Text } = Typography;

interface PredictionRecord {
  id: string;
  timestamp: string;
  formData: any;
  result: any;
}

interface PredictionHistoryProps {
  history: PredictionRecord[];
  onLoadData: (item: PredictionRecord) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
  onExportHistory: () => void;
}

const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onLoadData,
  onDeleteItem,
  onClearHistory,
  onExportHistory,
}) => {

  // 格式化时间
  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('zh-CN');
  };

  // 获取风险标签
  const getRiskTag = (prob: number, type: 'por' | 'hor') => {
    const color = prob < 0.3 ? 'green' : prob < 0.7 ? 'orange' : 'red';
    const text = `${(prob * 100).toFixed(1)}%`;
    return { color, text };
  };

  const handleDelete = (id: string) => {
    onDeleteItem(id);
    message.success('记录已删除');
  };

  const handleClear = () => {
    onClearHistory();
    message.success('历史记录已清空');
  };

  const handleLoad = (item: PredictionRecord) => {
    onLoadData(item);
    message.success('数据已加载到表单');
  };

  return (
    <Card
      title={
        <Space>
          <HistoryOutlined style={{ color: '#1890ff' }} />
          <span>预测历史</span>
          <Text type="secondary">({history.length})</Text>
        </Space>
      }
      extra={
        <Space>
          <Button
            size="small"
            icon={<DownloadOutlined />}
            onClick={onExportHistory}
            disabled={history.length === 0}
          >
            导出
          </Button>
          <Popconfirm
            title="确定要清空所有历史记录吗？"
            onConfirm={handleClear}
            disabled={history.length === 0}
          >
            <Button
              size="small"
              icon={<ClearOutlined />}
              danger
              disabled={history.length === 0}
            >
              清空
            </Button>
          </Popconfirm>
        </Space>
      }
      bodyStyle={{ padding: '16px' }}
    >
      {history.length === 0 ? (
        <Empty
          description="暂无预测历史"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <List
          dataSource={history}
          size="small"
          renderItem={(item) => {
            const porRisk = getRiskTag(item.result.por_prediction.poor_response_prob, 'por');
            const horRisk = getRiskTag(item.result.hor_prediction.high_response_prob, 'hor');

            return (
              <List.Item
                actions={[
                  <Button
                    key="load"
                    type="link"
                    size="small"
                    icon={<ReloadOutlined />}
                    onClick={() => handleLoad(item)}
                  >
                    加载
                  </Button>,
                  <Popconfirm
                    key="delete"
                    title="确定要删除这条记录吗？"
                    onConfirm={() => handleDelete(item.id)}
                  >
                    <Button
                      type="link"
                      size="small"
                      danger
                      icon={<DeleteOutlined />}
                    >
                      删除
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <List.Item.Meta
                  title={
                    <Space wrap>
                      <Text strong>
                        {formatDateTime(item.timestamp)}
                      </Text>
                      <Tag color={porRisk.color}>
                        POR: {porRisk.text}
                      </Tag>
                      <Tag color={horRisk.color}>
                        HOR: {horRisk.text}
                      </Tag>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Text type="secondary" style={{ fontSize: '12px' }}>
                        年龄: {item.formData.Age}岁 | AMH: {item.formData.AMH} | AFC: {item.formData.AFC}
                      </Text>
                    </Space>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Card>
  );
};

export default PredictionHistory;