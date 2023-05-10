import React from 'react';
import {Select, Icon} from 'frc-ui-pro';
import {deleteInvalid} from '../../utils';

/**
 * 表格头部组件 - 下拉框类型
 */
const TableInputTitle: React.FC<any> = (props) => {
  const {config, defaultText, onChange} = props;

  const {option = []} = config?.titleProps;

  const {Option} = Select;

  if (config.titleProps) {
    const titleStyle = {
      textAlign: config.titleProps.textAlign ? config.titleProps.textAlign : null
    };
    return (
      <div style={deleteInvalid(titleStyle)}>
        {option.length && (
          <Select
            defaultValue={option[0].value}
            style={{width: config.titleProps.width ? config.titleProps.width : 120}}
            type='no-border'
            extendSuffixIcon={<Icon type='lock' />}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(value: any) => {
              onChange && onChange(value);
            }}
          >
            {option.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        )}
      </div>
    );
  }

  return <span>{defaultText}</span>;
};

export default TableInputTitle;
