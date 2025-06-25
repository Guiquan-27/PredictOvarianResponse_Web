import { FormGroup, FormFieldMeta } from '@/types/prediction';

// 表单字段配置
export const FORM_FIELDS: FormFieldMeta[] = [
  // 基本信息
  {
    key: 'Age',
    label: '年龄',
    unit: '岁',
    type: 'number',
    min: 18,
    max: 50,
    step: 1,
    required: true,
    helpText: '请输入患者当前年龄（18-50岁）',
    placeholder: '例如：28'
  },
  {
    key: 'Duration',
    label: '治疗时长',
    unit: '月',
    type: 'number',
    min: 0,
    max: 120,
    step: 1,
    required: true,
    helpText: '辅助生殖治疗的持续时间',
    placeholder: '例如：6'
  },
  {
    key: 'Weight',
    label: '体重',
    unit: 'kg',
    type: 'number',
    min: 35,
    max: 150,
    step: 0.1,
    precision: 1,
    required: true,
    helpText: '患者当前体重',
    placeholder: '例如：55.5'
  },
  
  // 激素水平
  {
    key: 'FSH',
    label: '促卵泡激素',
    unit: 'mIU/mL',
    type: 'number',
    min: 0,
    max: 50,
    step: 0.01,
    precision: 2,
    required: true,
    helpText: 'FSH水平，通常在月经周期第2-3天检测',
    placeholder: '例如：6.85'
  },
  {
    key: 'LH',
    label: '促黄体激素',
    unit: 'mIU/mL',
    type: 'number',
    min: 0,
    max: 100,
    step: 0.01,
    precision: 2,
    required: true,
    helpText: 'LH水平，通常在月经周期第2-3天检测',
    placeholder: '例如：4.12'
  },
  {
    key: 'AMH',
    label: '抗缪勒氏管激素',
    unit: 'ng/mL',
    type: 'number',
    min: 0,
    max: 20,
    step: 0.01,
    precision: 2,
    required: true,
    helpText: 'AMH水平，反映卵巢储备功能的重要指标',
    placeholder: '例如：2.45'
  },
  {
    key: 'AFC',
    label: '窦卵泡计数',
    unit: '个',
    type: 'number',
    min: 0,
    max: 50,
    step: 1,
    required: true,
    helpText: '超声检查中双侧卵巢2-10mm窦卵泡总数',
    placeholder: '例如：12'
  },
  
  // 血压
  {
    key: 'DBP',
    label: '舒张压',
    unit: 'mmHg',
    type: 'number',
    min: 40,
    max: 120,
    step: 1,
    required: true,
    helpText: '血压测量的舒张压数值',
    placeholder: '例如：75'
  },
  
  // 血液检验
  {
    key: 'WBC',
    label: '白细胞计数',
    unit: '10⁹/L',
    type: 'number',
    min: 2,
    max: 20,
    step: 0.01,
    precision: 2,
    required: true,
    helpText: '血常规检查中的白细胞计数',
    placeholder: '例如：6.25'
  },
  {
    key: 'RBC',
    label: '红细胞计数',
    unit: '10¹²/L',
    type: 'number',
    min: 3,
    max: 7,
    step: 0.01,
    precision: 2,
    required: true,
    helpText: '血常规检查中的红细胞计数',
    placeholder: '例如：4.58'
  },
  {
    key: 'ALT',
    label: '丙氨酸转氨酶',
    unit: 'U/L',
    type: 'number',
    min: 0,
    max: 200,
    step: 1,
    required: true,
    helpText: '肝功能检查中的ALT水平',
    placeholder: '例如：25'
  },
  {
    key: 'P',
    label: '血磷',
    unit: 'mmol/L',
    type: 'number',
    min: 0.5,
    max: 3,
    step: 0.01,
    precision: 2,
    required: true,
    helpText: '血清磷浓度',
    placeholder: '例如：1.15'
  },
  {
    key: 'PLT',
    label: '血小板计数',
    unit: '10⁹/L',
    type: 'number',
    min: 50,
    max: 600,
    step: 1,
    required: true,
    helpText: '血常规检查中的血小板计数',
    placeholder: '例如：285'
  },
  
  // 病史
  {
    key: 'POIorDOR',
    label: '卵巢早衰/储备功能下降',
    type: 'switch',
    required: true,
    helpText: '是否存在卵巢早衰或储备功能下降',
  },
  {
    key: 'PCOS',
    label: '多囊卵巢综合征',
    type: 'switch',
    required: true,
    helpText: '是否诊断有多囊卵巢综合征',
  },
];

// 表单分组配置
export const FORM_GROUPS: FormGroup[] = [
  {
    title: '基本信息',
    description: '患者的基础生理指标',
    icon: 'user',
    fields: FORM_FIELDS.filter(field => 
      ['Age', 'Duration', 'Weight'].includes(field.key)
    ),
  },
  {
    title: '激素水平',
    description: '生殖激素检测结果',
    icon: 'experiment',
    fields: FORM_FIELDS.filter(field => 
      ['FSH', 'LH', 'AMH', 'AFC'].includes(field.key)
    ),
  },
  {
    title: '血压监测',
    description: '心血管系统指标',
    icon: 'heart',
    fields: FORM_FIELDS.filter(field => 
      ['DBP'].includes(field.key)
    ),
  },
  {
    title: '血液检验',
    description: '血常规和生化指标',
    icon: 'medicine-box',
    fields: FORM_FIELDS.filter(field => 
      ['WBC', 'RBC', 'ALT', 'P', 'PLT'].includes(field.key)
    ),
  },
  {
    title: '病史记录',
    description: '相关疾病史和诊断',
    icon: 'file-text',
    fields: FORM_FIELDS.filter(field => 
      ['POIorDOR', 'PCOS'].includes(field.key)
    ),
  },
];

// 表单默认值
export const DEFAULT_FORM_VALUES: Partial<Record<keyof import('@/types/prediction').PredictionFormData, number | boolean>> = {
  Age: undefined,
  Duration: undefined,
  Weight: undefined,
  FSH: undefined,
  LH: undefined,
  AMH: undefined,
  AFC: undefined,
  DBP: undefined,
  WBC: undefined,
  RBC: undefined,
  ALT: undefined,
  P: undefined,
  PLT: undefined,
  POIorDOR: false,
  PCOS: false,
};

// 表单验证规则
export const VALIDATION_RULES = {
  required: (value: any) => {
    if (value === undefined || value === null || value === '') {
      return '此字段为必填项';
    }
    return undefined;
  },
  
  number: (value: any) => {
    if (isNaN(Number(value))) {
      return '请输入有效的数字';
    }
    return undefined;
  },
  
  range: (min: number, max: number) => (value: number) => {
    if (value < min || value > max) {
      return `值应在 ${min} 到 ${max} 之间`;
    }
    return undefined;
  },
  
  precision: (decimals: number) => (value: number) => {
    const valueStr = value.toString();
    const decimalPart = valueStr.split('.')[1];
    if (decimalPart && decimalPart.length > decimals) {
      return `小数位数不能超过 ${decimals} 位`;
    }
    return undefined;
  },
}; 