#!/usr/bin/env node
/**
 * 使用示例数据测试卵巢反应预测 API
 */

const http = require('http');

// 示例数据 - 来自 simple_api.py 中的 sample_data
const sampleData = {
  "Age": 32,
  "Duration": 6,
  "Weight": 58,
  "FSH": 7.2,
  "LH": 4.8,
  "AMH": 2.1,
  "AFC": 12,
  "DBP": 78,
  "WBC": 6.2,
  "RBC": 4.4,
  "ALT": 22,
  "P": 1.1,
  "PLT": 280,
  "POIorDOR": 2,
  "PCOS": 2
};

const postData = JSON.stringify(sampleData);

const options = {
  hostname: '127.0.0.1',
  port: 8000,
  path: '/predict',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('='.repeat(80));
console.log('卵巢反应预测系统测试');
console.log('='.repeat(80));
console.log('\n📋 输入数据:');
console.log(JSON.stringify(sampleData, null, 2));

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n✅ API 响应状态:', res.statusCode);
    console.log('\n📊 预测结果:');
    try {
      const result = JSON.parse(data);
      console.log(JSON.stringify(result, null, 2));

      if (result.status === 'success') {
        console.log('\n📈 结果解读:');
        console.log(`  - 低反应 (POR) 概率: ${(result.por_prediction.poor_response_prob * 100).toFixed(1)}%`);
        console.log(`  - 正常反应概率: ${(result.por_prediction.normal_response_prob * 100).toFixed(1)}%`);
        console.log(`  - 高反应 (HOR) 概率: ${(result.hor_prediction.high_response_prob * 100).toFixed(1)}%`);
        console.log(`  - 正常反应概率: ${(result.hor_prediction.normal_response_prob * 100).toFixed(1)}%`);

        console.log('\n✨ 测试通过！');
      }
    } catch (e) {
      console.error('解析响应失败:', e.message);
      console.log('原始响应:', data);
    }
    console.log('='.repeat(80));
  });
});

req.on('error', (e) => {
  console.error('❌ 请求失败:', e.message);
  console.log('\n请确保后端服务器正在运行: python3 simple_api.py');
  console.log('='.repeat(80));
});

req.write(postData);
req.end();
