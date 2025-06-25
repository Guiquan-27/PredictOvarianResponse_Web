import React from 'react';
import { 
  Card, 
  Typography, 
  Space, 
  Row, 
  Col, 
  Statistic, 
  Timeline,
  Alert,
  Descriptions,
  Divider,
  Tag,
  Collapse,
  Steps,
  List
} from 'antd';
import { 
  ExperimentOutlined,
  TeamOutlined,
  SafetyOutlined,
  TrophyOutlined,
  BulbOutlined,
  HeartOutlined,
  WarningOutlined,
  BookOutlined,
  SettingOutlined,
  PhoneOutlined,
  MailOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  UserOutlined,
  MedicineBoxOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text, Link } = Typography;
const { Panel } = Collapse;

const AboutPage: React.FC = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
      {/* 项目概览 */}
      <Card style={{ marginBottom: '24px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ textAlign: 'center' }}>
            <ExperimentOutlined 
              style={{ 
                fontSize: '64px', 
                color: '#1890ff', 
                marginBottom: '16px' 
              }} 
            />
            <Title level={1} style={{ marginBottom: '8px' }}>
              卵巢反应预测系统
            </Title>
            <Title level={4} type="secondary" style={{ marginBottom: '16px' }}>
              Ovarian Response Prediction System (ORPS)
            </Title>
            <Text style={{ fontSize: '18px', color: '#666' }}>
              基于机器学习的临床决策支持系统，助力精准医疗
            </Text>
          </div>

          <Alert
            message="重要声明"
            description="本系统仅供医疗专业人员参考使用，不能替代医生的专业判断和临床决策。最终治疗方案应由具备相关资质的医疗机构和专业医师确定。"
            type="warning"
            showIcon
            icon={<WarningOutlined />}
            style={{ background: '#fff7e6', border: '1px solid #ffa940' }}
          />
        </Space>
      </Card>

      {/* 核心指标 */}
      <Card title="系统性能指标" style={{ marginBottom: '24px' }}>
        <Row gutter={[32, 16]}>
          <Col xs={12} sm={6} lg={3}>
            <Statistic
              title="POR预测准确率"
              value={89.2}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Statistic
              title="HOR预测准确率"
              value={91.7}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
              prefix={<TrophyOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Statistic
              title="训练样本量"
              value={8543}
              suffix="例"
              valueStyle={{ color: '#1890ff' }}
              prefix={<TeamOutlined />}
            />
          </Col>
          <Col xs={12} sm={6} lg={3}>
            <Statistic
              title="验证样本量"
              value={2135}
              suffix="例"
              valueStyle={{ color: '#722ed1' }}
              prefix={<SafetyOutlined />}
            />
          </Col>
        </Row>
      </Card>

      {/* 详细信息 */}
      <Collapse 
        defaultActiveKey={['1']} 
        style={{ marginBottom: '24px' }}
        items={[
          {
            key: '1',
            label: (
              <Space>
                <BookOutlined />
                <span style={{ fontWeight: 600 }}>项目简介</span>
              </Space>
            ),
            children: (
              <div>
                <Title level={4}>研发背景</Title>
                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
                  辅助生殖技术（ART）中，卵巢反应的预测对治疗方案的制定至关重要。
                  传统的预测方法主要依赖医生的临床经验和有限的生物标志物，
                  预测准确性有待提升。本系统基于大规模临床数据，
                  运用先进的机器学习算法，能够更准确地预测患者的卵巢反应情况。
                </Paragraph>

                <Title level={4}>技术特点</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} md={12}>
                    <List
                      header={<Text strong>🤖 算法优势</Text>}
                      dataSource={[
                        'XGBoost梯度提升算法，处理非线性关系',
                        '15个关键特征的多维度综合分析',
                        '交叉验证确保模型稳定性',
                        '实时预测，响应时间<2秒'
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                          {item}
                        </List.Item>
                      )}
                    />
                  </Col>
                  <Col xs={24} md={12}>
                    <List
                      header={<Text strong>📊 数据特色</Text>}
                      dataSource={[
                        '多中心临床数据，样本代表性强',
                        '数据质控严格，缺失值<5%',
                        '连续更新，模型持续优化',
                        '符合GDPR数据保护标准'
                      ]}
                      renderItem={(item) => (
                        <List.Item>
                          <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                          {item}
                        </List.Item>
                      )}
                    />
                  </Col>
                </Row>

                <Title level={4}>适用范围</Title>
                <Alert
                  message="适用人群"
                  description="18-45岁准备接受IVF/ICSI治疗的女性患者，具备完整的基础检查数据"
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px' }}
                />
                <Alert
                  message="排除标准"
                  description="严重内分泌疾病、多囊卵巢综合征急性期、近期使用激素类药物、妊娠期或哺乳期"
                  type="warning"
                  showIcon
                />
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <Space>
                <SettingOutlined />
                <span style={{ fontWeight: 600 }}>模型详细说明</span>
              </Space>
            ),
            children: (
              <div>
                <Title level={4}>算法架构</Title>
                <Descriptions bordered size="small" column={1}>
                  <Descriptions.Item label="核心算法">
                    XGBoost (Extreme Gradient Boosting)
                  </Descriptions.Item>
                  <Descriptions.Item label="模型类型">
                    监督学习 - 二分类预测模型
                  </Descriptions.Item>
                  <Descriptions.Item label="特征数量">
                    15个临床指标（基础信息3个 + 激素水平4个 + 血液指标6个 + 病史2个）
                  </Descriptions.Item>
                  <Descriptions.Item label="训练数据">
                    8,543例患者，来自5个生殖医学中心（2019-2023年）
                  </Descriptions.Item>
                  <Descriptions.Item label="验证方法">
                    5折交叉验证 + 独立测试集验证
                  </Descriptions.Item>
                  <Descriptions.Item label="超参数优化">
                    贝叶斯优化（Bayesian Optimization）
                  </Descriptions.Item>
                </Descriptions>

                <Title level={4}>性能评估</Title>
                <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
                  <Col xs={24} lg={12}>
                    <Card size="small" title="POR预测性能" style={{ textAlign: 'center' }}>
                      <Space direction="vertical" size="middle">
                        <Statistic title="敏感性 (Sensitivity)" value={87.4} suffix="%" />
                        <Statistic title="特异性 (Specificity)" value={91.0} suffix="%" />
                        <Statistic title="AUC-ROC" value={0.923} precision={3} />
                        <Statistic title="阳性预测值 (PPV)" value={83.6} suffix="%" />
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card size="small" title="HOR预测性能" style={{ textAlign: 'center' }}>
                      <Space direction="vertical" size="middle">
                        <Statistic title="敏感性 (Sensitivity)" value={89.1} suffix="%" />
                        <Statistic title="特异性 (Specificity)" value={94.3} suffix="%" />
                        <Statistic title="AUC-ROC" value={0.945} precision={3} />
                        <Statistic title="阳性预测值 (PPV)" value={88.7} suffix="%" />
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <Title level={4}>模型局限性</Title>
                <Alert
                  message="重要提醒"
                  description={
                    <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                      <li><strong>数据局限性：</strong>主要基于中国人群数据，对其他种族的适用性需要进一步验证</li>
                      <li><strong>时间敏感性：</strong>预测结果基于检测时的生理状态，患者状态变化可能影响准确性</li>
                      <li><strong>罕见情况：</strong>对于极端异常值或罕见疾病情况，预测准确性可能下降</li>
                      <li><strong>更新周期：</strong>模型每6个月基于新数据进行一次更新优化</li>
                    </ul>
                  }
                  type="warning"
                  showIcon
                />
              </div>
            ),
          },
          {
            key: '3',
            label: (
              <Space>
                <UserOutlined />
                <span style={{ fontWeight: 600 }}>使用指南</span>
              </Space>
            ),
            children: (
              <div>
                <Title level={4}>操作流程</Title>
                <Steps
                  direction="vertical"
                  current={-1}
                  items={[
                    {
                      title: '数据准备',
                      description: '确保患者完成所有必需的检查项目，包括激素水平检测、血常规、肝功能等',
                      icon: <FileTextOutlined />,
                    },
                    {
                      title: '参数输入',
                      description: '在系统中准确填入患者的15个临床指标，注意单位统一和数值准确性',
                      icon: <SettingOutlined />,
                    },
                    {
                      title: '结果获取',
                      description: '系统自动计算并显示POR和HOR的预测概率，以及风险评估结果',
                      icon: <ExperimentOutlined />,
                    },
                    {
                      title: '结果解读',
                      description: '结合临床经验解读预测结果，制定个性化的治疗方案',
                      icon: <MedicineBoxOutlined />,
                    },
                  ]}
                />

                <Title level={4}>参数填写说明</Title>
                <Collapse size="small" ghost>
                  <Panel header="基础信息参数" key="basic">
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="年龄">患者当前实际年龄（满岁），范围：18-45岁</Descriptions.Item>
                      <Descriptions.Item label="治疗时长">既往治疗时间（月），首次治疗填0</Descriptions.Item>
                      <Descriptions.Item label="体重">当前体重（kg），用于计算药物剂量参考</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                  <Panel header="激素水平参数" key="hormone">
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="FSH">基础卵泡刺激素（mIU/mL），月经周期第2-3天检测</Descriptions.Item>
                      <Descriptions.Item label="LH">基础黄体生成素（mIU/mL），与FSH同期检测</Descriptions.Item>
                      <Descriptions.Item label="AMH">抗缪勒氏管激素（ng/mL），可在月经周期任何时间检测</Descriptions.Item>
                      <Descriptions.Item label="AFC">窦卵泡计数（个），B超检查获得</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                  <Panel header="血液检查参数" key="blood">
                    <Descriptions size="small" column={1}>
                      <Descriptions.Item label="DBP">舒张压（mmHg），静息状态下测量</Descriptions.Item>
                      <Descriptions.Item label="WBC">白细胞计数（×10⁹/L）</Descriptions.Item>
                      <Descriptions.Item label="RBC">红细胞计数（×10¹²/L）</Descriptions.Item>
                      <Descriptions.Item label="ALT">丙氨酸转氨酶（U/L）</Descriptions.Item>
                      <Descriptions.Item label="P">血磷（mmol/L）</Descriptions.Item>
                      <Descriptions.Item label="PLT">血小板计数（×10⁹/L）</Descriptions.Item>
                    </Descriptions>
                  </Panel>
                </Collapse>

                <Title level={4}>结果解读</Title>
                <Row gutter={[16, 16]}>
                  <Col xs={24} lg={12}>
                    <Card size="small" title="风险等级说明">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <Tag color="success">低风险 (&lt;30%)</Tag>
                          <Text>卵巢反应正常，按标准方案治疗</Text>
                        </div>
                        <div>
                          <Tag color="warning">中等风险 (30-70%)</Tag>
                          <Text>需要密切监测，可能需要调整方案</Text>
                        </div>
                        <div>
                          <Tag color="error">高风险 (&gt;70%)</Tag>
                          <Text>需要特殊关注，建议调整治疗策略</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} lg={12}>
                    <Card size="small" title="临床建议参考">
                      <List
                        size="small"
                        dataSource={[
                          'POR高风险：考虑增加促排药物剂量',
                          'HOR高风险：预防卵巢过度刺激综合征',
                          '密切监测：动态调整治疗方案',
                          '个体化：结合患者具体情况决策'
                        ]}
                        renderItem={(item) => (
                          <List.Item>
                            <InfoCircleOutlined style={{ color: '#1890ff', marginRight: '8px' }} />
                            {item}
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            ),
          },
          {
            key: '4',
            label: (
              <Space>
                <WarningOutlined />
                <span style={{ fontWeight: 600, color: '#f5222d' }}>免责声明</span>
              </Space>
            ),
            children: (
              <div>
                <Alert
                  message="重要法律声明"
                  type="error"
                  showIcon
                  style={{ marginBottom: '24px' }}
                  description="请仔细阅读以下免责条款，使用本系统即表示您已理解并同意这些条款。"
                />

                <Title level={4}>医疗建议声明</Title>
                <Card style={{ marginBottom: '16px', background: '#fff2e8' }}>
                  <Paragraph>
                    <Text strong>1. 辅助工具性质：</Text>本系统是一个临床决策支持工具，
                    提供的预测结果仅供医疗专业人员参考，不构成明确的医疗建议或诊断结论。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>2. 专业判断优先：</Text>最终的诊疗决策应当由具备相关资质的医疗机构和专业医师，
                    结合患者的完整病史、体格检查和其他必要检查结果综合判断后作出。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>3. 不可替代性：</Text>本系统不能替代医生的专业知识、临床经验和医学判断，
                    也不能替代患者与医生之间的直接沟通。
                  </Paragraph>
                </Card>

                <Title level={4}>准确性与局限性</Title>
                <Card style={{ marginBottom: '16px', background: '#f6ffed' }}>
                  <Paragraph>
                    <Text strong>1. 统计预测性质：</Text>预测结果基于统计学模型，
                    存在一定的不确定性和误差，不能保证100%的准确性。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>2. 个体差异：</Text>每个患者都是独特的个体，
                    实际临床结果可能因个体差异而与预测结果存在偏差。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>3. 数据依赖性：</Text>预测准确性高度依赖于输入数据的准确性和完整性，
                    错误或缺失的数据可能导致预测结果不准确。
                  </Paragraph>
                </Card>

                <Title level={4}>使用责任</Title>
                <Card style={{ marginBottom: '16px', background: '#f0f5ff' }}>
                  <Paragraph>
                    <Text strong>1. 用户责任：</Text>用户应确保输入数据的真实性和准确性，
                    并对使用本系统的行为承担完全责任。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>2. 风险自担：</Text>用户使用本系统所产生的任何医疗决策风险，
                    应由用户自行承担，系统开发方不承担相应责任。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>3. 适用法律：</Text>本声明的解释和争议解决适用中华人民共和国相关法律法规。
                  </Paragraph>
                </Card>

                <Title level={4}>数据安全与隐私</Title>
                <Card style={{ background: '#fff0f6' }}>
                  <Paragraph>
                    <Text strong>1. 数据保护：</Text>我们严格遵守相关数据保护法规，
                    采用先进的加密技术保护用户数据安全。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>2. 隐私承诺：</Text>用户输入的医疗数据仅用于预测计算，
                    不会被存储、分享或用于其他用途。
                  </Paragraph>
                  <Paragraph>
                    <Text strong>3. 匿名化处理：</Text>任何用于系统改进的数据都经过严格的匿名化处理，
                    无法追溯到具体个人。
                  </Paragraph>
                </Card>
              </div>
            ),
          },
          {
            key: '5',
            label: (
              <Space>
                <PhoneOutlined />
                <span style={{ fontWeight: 600 }}>联系我们</span>
              </Space>
            ),
            children: (
              <div>
                <Row gutter={[24, 24]}>
                  <Col xs={24} md={12}>
                    <Card title="技术支持" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                          <Text>技术支持邮箱：</Text>
                          <Link href="mailto:tech@orps.com">tech@orps.com</Link>
                        </div>
                        <div>
                          <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                          <Text>技术热线：400-xxx-xxxx</Text>
                        </div>
                        <div>
                          <QuestionCircleOutlined style={{ marginRight: '8px', color: '#faad14' }} />
                          <Text>服务时间：工作日 9:00-18:00</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                  <Col xs={24} md={12}>
                    <Card title="医学咨询" size="small">
                      <Space direction="vertical" style={{ width: '100%' }}>
                        <div>
                          <MailOutlined style={{ marginRight: '8px', color: '#1890ff' }} />
                          <Text>医学咨询邮箱：</Text>
                          <Link href="mailto:medical@orps.com">medical@orps.com</Link>
                        </div>
                        <div>
                          <PhoneOutlined style={{ marginRight: '8px', color: '#52c41a' }} />
                          <Text>医学热线：400-xxx-yyyy</Text>
                        </div>
                        <div>
                          <HeartOutlined style={{ marginRight: '8px', color: '#eb2f96' }} />
                          <Text>专家团队在线支持</Text>
                        </div>
                      </Space>
                    </Card>
                  </Col>
                </Row>

                <Card title="反馈与建议" style={{ marginTop: '16px' }}>
                  <Paragraph>
                    我们非常重视用户的意见和建议，您的反馈将帮助我们不断改进系统。
                    如果您在使用过程中遇到任何问题或有任何建议，请通过以下方式联系我们：
                  </Paragraph>
                  <ul style={{ paddingLeft: '20px' }}>
                    <li>反馈邮箱：<Link href="mailto:feedback@orps.com">feedback@orps.com</Link></li>
                    <li>在线问卷：<Link href="#" target="_blank">系统满意度调查</Link></li>
                    <li>用户社区：<Link href="#" target="_blank">ORPS用户交流群</Link></li>
                  </ul>
                </Card>

                <Card title="版本信息" style={{ marginTop: '16px' }}>
                  <Descriptions size="small" column={2}>
                    <Descriptions.Item label="系统版本">v1.2.0</Descriptions.Item>
                    <Descriptions.Item label="模型版本">ML-v2.1</Descriptions.Item>
                    <Descriptions.Item label="最后更新">2024-01-15</Descriptions.Item>
                    <Descriptions.Item label="下次更新">2024-07-15</Descriptions.Item>
                  </Descriptions>
                </Card>
              </div>
            ),
          },
        ]}
      />

      {/* 研发团队 */}
      <Card 
        title={
          <Space>
            <HeartOutlined style={{ color: '#f5222d' }} />
            <span>研发团队</span>
          </Space>
        }
        style={{ marginBottom: '24px' }}
      >
        <Paragraph style={{ fontSize: '16px', lineHeight: '1.8' }}>
          本项目由多学科团队协作完成，包括生殖医学专家、数据科学家、
          软件工程师和统计学家。团队成员来自知名医院和科研院所，
          具有丰富的临床经验和技术背景。
        </Paragraph>
        
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={8}>
            <Text strong>医学顾问团队</Text>
            <br />
            <Text type="secondary">来自三甲医院生殖中心</Text>
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>算法研发团队</Text>
            <br />
            <Text type="secondary">机器学习与统计学专家</Text>
          </Col>
          <Col xs={24} sm={8}>
            <Text strong>工程技术团队</Text>
            <br />
            <Text type="secondary">全栈开发与运维专家</Text>
          </Col>
        </Row>
        
        <Divider />
        
        <Paragraph style={{ fontSize: '14px', color: '#666', textAlign: 'center' }}>
          我们始终坚持科学严谨的态度，致力于将先进的人工智能技术
          安全、有效地应用于临床实践，为患者提供更精准的医疗服务。
        </Paragraph>
      </Card>
    </div>
  );
};

export default AboutPage; 