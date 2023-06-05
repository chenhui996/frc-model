/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
import { isEqual } from 'lodash';
// import {
//   inQb, openNewBondDetail, openPage
// } from '../const/qb-service/index';
import {
  inQb, openNewBondDetail, openPage
} from 'frc-core-pro';
import moment from 'moment';
import { SingleStepProps, NormalReturn, TagStepProps, TagStepSpecifiedProps } from '../type';
import { deleteInvalid } from '../utils';

/**
 * 对象型：“单字段”取值
 */
const frcSingleField: SingleStepProps = (record, config, step, relayValue = null, valueFields = [], attribute = {}) => {
  const { extra: configExtra = false, defaultText = '--' } = config;
  const { extra: attrExtra = false, fitValue } = attribute; // 优先级较高

  let result: NormalReturn = step !== 0 ? relayValue : record[valueFields[0]];

  if (fitValue?.length && fitValue.includes(result)) {
    return result;
  }

  if (configExtra || attrExtra) {
    result = result || null;
  } // 精确显示，若出现 --，过滤成 null

  if (!configExtra && !attrExtra) {
    result = result || defaultText;
  } // 非精确显示，兜底显示（传参给到

  return result;
};

/**
 * 取值 -> “价格默认值” -> 条件：“交易量有效” 或 “交易描述有效”，但是 “价格无效”
 */
const frcPriceInvalid: SingleStepProps = (
  record,
  config,
  step,
  relayValue = null,
  valueFields = {},
  attribute = {}
) => {
  let result: NormalReturn = step !== 0 ? (relayValue as NormalReturn) : null;
  const { defaultText } = attribute;

  if (!valueFields || Object.keys(valueFields).length !== 3) {
    return result;
  } // check valueFields

  const { vol, dsc, px } = valueFields as { [key: string]: string | number };

  if ((record[vol] || record[dsc]) && !record[px] && record[px] !== 0) {
    result = defaultText as string;
  } // core part

  return result;
};

/**
 * tag 标签 -> N、F、YTM
 */
const frcTagQuoteArr: TagStepProps<{ text: string; color: string }[]> = (
  record,
  config,
  step,
  relayValue = [],
  valueFields = {}
) => {
  let result: { text: string; color: string }[] = step !== 0 ? relayValue : [];

  if (!valueFields || Object.keys(valueFields).length !== 4) {
    return result;
  } // check valueFields

  const { px, type, residualMaturity, askExrcsFlg } = valueFields as { [key: string]: string | number };

  if (Object.prototype.toString.call(result) === '[object Array]') {
    if (record[px] && Number(record[type]) === 1) {
      // displayText = askDtPrc;
      result = [...result, { text: 'N', color: 'rgb(51,161,95)' }];
    } // 1

    if (record[px] && Number(record[type]) === 2) {
      // displayText = askClPrc;
      result = [...result, { text: 'F', color: '#f75424' }];
    } // 2

    if (
      typeof record[residualMaturity] === 'string' &&
      (record[residualMaturity] as string)?.indexOf('+') !== -1 &&
      record[askExrcsFlg] === 1 &&
      Number(record[type]) === 3
    ) {
      result = [...result, { text: 'YTM', color: '#865098' }];
    } // icon: YTM
  }

  return result;
};

/**
 * tag 标签 -> N、F、N.D
 */
const frcTagDealArr: TagStepProps<{ text: string; color: string }[]> = (
  record,
  config,
  step,
  relayValue = [],
  valueFields = {}
) => {
  let result: { text: string; color: string }[] = step !== 0 ? relayValue : [];

  if (!valueFields || Object.keys(valueFields).length !== 3) {
    return result;
  } // check valueFields

  const { px, type, dealSts } = valueFields as { [key: string]: string | number };

  if (Object.prototype.toString.call(result) === '[object Array]' && record[px]) {
    if (Number(record[type]) === 1) {
      // displayText = askDtPrc;
      result = [...result, { text: 'N', color: 'rgb(51,161,95)' }];
    } // 1

    if (Number(record[type]) === 2) {
      // displayText = askClPrc;
      result = [...result, { text: 'F', color: '#f75424' }];
    } // 2

    if (Number(dealSts) === 2) {
      // displayText = bidClPrc;
      result = [...result, { text: 'N.D', color: 'rgb(123,128,130)' }];
    } // N.D
  }

  return result;
};

/**
 * icon 图标 -> * 或 **
 */
const frcStarIcon: SingleStepProps = (record, config, step, relayValue = [], valueFields = {}) => {
  let result: string | null = step !== 0 ? (relayValue as string | null) : null;

  if (!valueFields || Object.keys(valueFields).length !== 1) {
    return result;
  } // check valueFields

  const { dsc } = valueFields as { [key: string]: string | number };

  if (record[dsc]) {
    if ((record[dsc] as string).indexOf('(*)') !== -1) {
      result = 'need-to-ask';
    }

    if ((record[dsc] as string).indexOf('(**)') !== -1) {
      result = 'need-to-ask-2';
    }
  } // */**

  return result;
};

/**
 * 文本映射 -> 跨市场
 */
const frcCrsMarketMapping: SingleStepProps = (record, config, step, relayValue = [], valueFields = []) => {
  let result: string = step !== 0 ? (relayValue as string | null) : record[valueFields[0]] || null;

  if (result === 'Y') {
    result = '是';
  }

  if (result === 'N') {
    result = '否';
  }

  return result;
};

/**
 * tag 标签 -> 5经纪商
 */
const frcTagContributorNm: TagStepProps<{ text: string; backgroundColor: string } | null> = (
  record,
  config,
  step,
  relayValue,
  valueFields = []
) => {
  const filedValue: string = step !== 0 ? relayValue : record[valueFields[0]] || null;
  let result: { text: string; backgroundColor: string } | null = null;

  if (filedValue === '国际货币') {
    result = {
      text: '国际',
      backgroundColor: '#bf4c4d'
    };
  }

  if (filedValue === '中诚保捷思') {
    result = {
      text: '中诚',
      backgroundColor: '#608229'
    };
  }

  if (filedValue === '平安利顺') {
    result = {
      text: '平安',
      backgroundColor: '#ff5f2c'
    };
  }

  if (filedValue === '天津信唐') {
    result = {
      text: '信唐',
      backgroundColor: '#865098'
    };
  }

  if (filedValue === '国利货币') {
    result = {
      text: '国利',
      backgroundColor: '#346687'
    };
  }

  return result;
};

/**
 * tag 标签 -> 成交标签
 */
const frcTradeMeth: TagStepProps<{ text: string; color: string } | null> = (
  record,
  config,
  step,
  relayValue,
  valueFields = []
) => {
  const filedValue: string = step !== 0 ? relayValue : record[valueFields[0]] || null;
  let result: { text: string; color: string } | null = null;

  if (filedValue === '1') {
    result = {
      text: 'GVN',
      color: 'rgb(255,125,0)'
    };
  }

  if (filedValue === '2') {
    result = {
      text: 'TKN',
      color: 'rgb(0,154,255)'
    };
  }

  if (filedValue === '3') {
    result = {
      text: 'TRD',
      color: 'rgb(0,167,79)'
    };
  }

  return result;
};

/**
 * 取值 -> '/' 分割 -> 行权 / 到期
 */
const frcTextExrcsMaturityConcat: SingleStepProps = (
  record,
  config,
  step,
  relayValue,
  valueFields = {},
  attribute = {}
) => {
  let result: any = null;
  const { toFixed } = attribute;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { exrcs, maturity } = valueFields as { [key: string]: string };

  let exrcsValue = record[exrcs] || null;
  let maturityValue = record[maturity] || null;

  if (toFixed) {
    exrcsValue = exrcsValue?.toFixed(toFixed);
    maturityValue = maturityValue?.toFixed(toFixed);
  }

  // only maturity
  if (maturityValue && !exrcsValue) {
    result = maturityValue;
  }

  // only exrcs
  if (!maturityValue && exrcsValue) {
    result = exrcsValue;
  }

  // both
  if (maturityValue && exrcsValue) {
    result = `${exrcsValue}/${maturityValue}`;
  }

  return result;
};

/**
 * tag -> 提示框 -> 行权 / 到期
 */
const frcTagExrcsMaturityConcat: TagStepProps<Array<string | number | null> | null> = (
  record,
  config,
  step,
  relayValue,
  valueFields = {},
  attribute = {}
) => {
  let result: Array<string | number | null> | null = null;
  const { toFixed, showTitle } = attribute;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { exrcs, maturity } = valueFields as { [key: string]: string };

  let exrcsValue = record[exrcs] || null;
  let maturityValue = record[maturity] || null;
  let title: string | number | null = null;
  let text: string | number | null = null;

  if (toFixed) {
    exrcsValue = exrcsValue?.toFixed(toFixed);
    maturityValue = maturityValue?.toFixed(toFixed);
  }

  // only exrcs -> 只有 行权 存在，才可以展示角标
  if (exrcsValue) {
    text = exrcsValue;
    title = showTitle ? '行权' : null;

    // both
    if (maturityValue) {
      text = `${exrcsValue}/${maturityValue}`;
      title = showTitle ? '行权/到期' : null;
    }

    result = [title, text].filter((item) => item !== null);
  }

  return result;
};

/**
 * tag -> 提示框 -> 行权
 */
const frcTagExrcsFlg: TagStepSpecifiedProps<string | number | null, Array<string | number | null>> = (
  record,
  config,
  step,
  relayValue,
  valueFields = {},
  attribute = {}
) => {
  let result: Array<string | number | null> | null = null;
  const { showTitle } = attribute;

  if (!valueFields || Object.keys(valueFields).length !== 1) {
    return result;
  } // check valueFields

  const { exrcsFlg } = valueFields as { [key: string]: string };

  let title: string | number | null = null;
  let text: string | number | null = null;

  // only exrcs -> 只有 行权 存在，才可以展示角标
  if (exrcsFlg === '0') {
    text = relayValue || null;
    title = showTitle ? '行权' : null;

    result = [title, text].filter((item) => item !== null);
  }

  return result;
};

/**
 * 取值 -> vol or dsc
 */
const frcVolOrDsc: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  let result: string | null = null;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { vol, dsc } = valueFields as { [key: string]: string };

  if (record[vol]) {
    result = record[vol];
  } else if (record[dsc]) {
    result = record[dsc];
  } // text

  return result;
};

/**
 * 取值 -> 剩余期限 -> 节假日数字
 */
const frcHolidayNumber: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  let result: string | null = record[valueFields[0]] || null;

  if (!valueFields || valueFields.length !== 1) {
    return result;
  } // check valueFields

  if (result) {
    result = result.substring(1);
  }

  return result;
};

/**
 * 取值 -> 剩余期限 -> 节假日类型
 */
const frcHolidayType: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  let result: string | null = null;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { flg, type } = valueFields as { [key: string]: string };

  if (record[flg]) {
    result = record[type];
  } // text

  return result;
};

/**
 * 判断 -> SHOW ALL 按钮 -> 激活 SHOW ALL 状态
 */
const frcShowAllWork: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  let result: boolean = false;

  if (!valueFields || Object.keys(valueFields).length !== 1) {
    return result;
  } // check valueFields

  const { initObj } = valueFields as { [key: string]: object };

  const { work } = config;

  if (work) {
    result = Object.keys(deleteInvalid(record)).length === 1 && isEqual(deleteInvalid(record), initObj);
  } // text

  return result;
};

/**
 * 判断计算 -> 涨跌文本颜色
 */
const frcTrdPxNetChgColor: SingleStepProps = (record, config, step, relayValue) => {
  let result: string = '#FFEBC8';

  const value: number | null = (relayValue as number) || null;

  if (Number(value) > 0) {
    result = '#FF4333';
  } else if (Number(value) < 0) {
    result = '#00B563';
  } else if (Number(value) === 0) {
    result = '#FFEBC8';
  }

  return result;
};

/**
 * 判断计算 -> 买一价、卖一价文本颜色
 */
const frcBidOrAskColor: SingleStepProps = (record, config, step, relayValue, valueFields = []) => {
  let result: string = '#FFEBC8';

  const bidOrAskValue = record[valueFields[0]] || null;
  const value: number | null = (relayValue as number) || null;

  // console.log(bidOrAskValue, value);
  if(!bidOrAskValue || !value){
    return result;
  }
  

  if (Number(bidOrAskValue) > Number(value)) {
    result = '#FF4333';
  } else if (Number(bidOrAskValue) < Number(value)) {
    result = '#00B563';
  } else if (Number(bidOrAskValue) === Number(value)) {
    result = '#FFEBC8';
  }

  return result;
};

/**
 * 判断计算 -> 估值偏离 bp 文本颜色
 */
const frcValBpColor: SingleStepProps = (record, config, step, relayValue) => {
  let result: string = '#FFEBC8';

  const value: number | null = (relayValue as number) || null;

  if (Number(value) > 0) {
    result = '#00B563';
  } else if (Number(value) < 0) {
    result = '#FF4333';
  } else if (Number(value) === 0) {
    result = '#FFEBC8';
  }

  return result;
};

/**
 * 取值 -> 根据 type 判断取 cdc 或 csi 的值
 */
const frcCdcOrCsiValue: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  let result: string | number | null = null;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { valueType = 'cdc' } = config;
  const { cdc, csi } = valueFields as { [key: string]: string | number };

  const cdcValue = record[cdc] ?? null;
  const csiValue = record[csi] ?? null;

  if (valueType === 'cdc') {
    result = cdcValue;
  }

  if (valueType === 'csi') {
    result = csiValue;
  }

  return result;
};

/**
 * 跳转 -> 债券详情 bond detail -> C Function
 */
const frcJumpBondDetail: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return null;
  }

  const { bondKey, listedMarket } = valueFields as { [key: string]: string | number };

  if (!record[bondKey] || !record[listedMarket]) {
    return null;
  }

  return () => {
    if (inQb()) {
      openNewBondDetail(
        { bondkey: record[bondKey], listedmarket: record[listedMarket] },
        ({ ret }) => {
          if (ret) {
            console.log('返回C++页面成功');
          }
        },
        ({ errorMessage }: any) => {
          console.log('返回C++页面失败:', errorMessage as string);
        }
      );
    }
  };
};

/**
 * 跳转 -> 发行人详情 issuer detail -> C Function
 */
const frcJumpIssuerDetail: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  if (!valueFields || Object.keys(valueFields).length !== 3) {
    return null;
  }

  const { issuerCode, bondId, listedMarket } = valueFields as { [key: string]: string | number };

  if (!record[issuerCode] && !record[bondId] && !record[listedMarket]) {
    return null;
  }

  return () => {
    if (inQb()) {
      openPage({
        name: 'issuer_detail_web',
        pageid: 77058,
        subpage: 0,
        param: `issuerCode=${record[issuerCode]}&bondId=${record[bondId]}&isAdditionalBond=false&listedMarket=${record[listedMarket]}`
      });
    }
  };
};

/**
 * 加工值 -> 根据 value 正负，添加 + | - 符号 -> "cdc 或 csi 专用"
 */
const frcCdcOrCsiAddPlusOrMinus: SingleStepProps = (record, config, step, relayValue, valueFields = {}) => {
  let result: string | number | null = step !== 0 ? (relayValue as number | null) : null;
  let icon: string | null = null;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { valueType = 'cdc' } = config;
  const { cdc, csi } = valueFields as { [key: string]: string | number };

  const cdcValue = record[cdc] ?? 0;
  const csiValue = record[csi] ?? 0;

  if (valueType === 'cdc' && cdcValue !== 0) {
    icon = Number(cdcValue) > 0 ? '+' : '-';
  }

  if (valueType === 'csi' && csiValue !== 0) {
    icon = Number(csiValue) > 0 ? '+' : '-';
  }

  result = icon ? icon + result : result;

  return result;
};

/**
 * 取值：成交(deal) -> 日期: 非工作时间取值
 */
const frcNotWorkDealDate: SingleStepProps = (record, config, step, relayValue, valueFields = []) => {
  let result: string | null = null;

  if (!valueFields || Object.keys(valueFields).length !== 2) {
    return result;
  } // check valueFields

  const { time, date } = valueFields as { [key: string]: string };
  const today = moment(Date.now()).format('YYYY-MM-DD');

  if (record[date] && record[time]) {
    if (moment(record[date]).isSame(today, 'day')) {
      result = record[time];
    } else {
      result = record[date];
    }
  }

  return result;
};

export {
  frcSingleField,
  frcPriceInvalid,
  frcTagQuoteArr,
  frcTagDealArr,
  frcStarIcon,
  frcCrsMarketMapping,
  frcTagContributorNm,
  frcTextExrcsMaturityConcat,
  frcTagExrcsMaturityConcat,
  frcTagExrcsFlg,
  frcVolOrDsc,
  frcHolidayNumber,
  frcHolidayType,
  frcTradeMeth,
  frcShowAllWork,
  frcTrdPxNetChgColor,
  frcBidOrAskColor,
  frcValBpColor,
  frcCdcOrCsiValue,
  frcJumpBondDetail,
  frcJumpIssuerDetail,
  frcCdcOrCsiAddPlusOrMinus,
  frcNotWorkDealDate
};
