import React from 'react';
import {Tooltip} from 'frc-ui-pro';
import cn from 'classnames';
import computeMap, {frcFormulaSelect} from '../../compute';
import {NormalTableComponentProps} from '../../type';
import {deleteInvalid} from '../../utils';
import './style.less';

const NormalString: React.FC<NormalTableComponentProps> = (props) => {
  const {record, config} = props;

  const text = frcFormulaSelect<object, string | number | boolean>(record, config, computeMap, 'text'); // 文本
  const textColor = frcFormulaSelect<object, string | number | boolean>(record, config, computeMap, 'color'); // color
  const textClick = frcFormulaSelect<object, string | number | boolean>(record, config, computeMap, 'click'); // click

  const {textType, styles} = config;
  const {textAlign, color} = styles || {};

  const textStyle = deleteInvalid({
    // width: '100%',
    textAlign: textAlign || null,
    color: textColor || color || null
  }) as any;

  const toolTipStyle = deleteInvalid({
    width: '100%',
    height: 23,
    textAlign: textAlign || null
  }) as any;

  const textClassNames = cn({
    'text-link': textType === 'link' && textClick !== 2
  });

  const textConfig = deleteInvalid({
    className: textClassNames || null,
    onClick: textClick || null
  }) as any;

  return (
    <span className='frc-table-string-box'>
      {config.ellipsis ? (
        <Tooltip style={toolTipStyle} overText title={text} hasArrow={false}>
          <span {...textConfig} style={textStyle}>
            {text}
          </span>
        </Tooltip>
      ) : (
        <span {...textConfig} style={{...textStyle, display: 'inline-block'}}>
          {text}
        </span>
      )}
    </span>
  ); // 纯渲染
}; // normal number field component

export default NormalString;
