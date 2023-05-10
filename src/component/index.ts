import React from 'react';
import SelectComponent from './SelectComponent';
import BondSearch from './bondSearch/BondSearch';
import LabelFilter from './labelFilter/LabelFilter';
import LabelFilterInputRange from './labelFilterInputRange/LabelFilterInputRange';
import LabelGroupFilter from './labelGroupFilter/LabelGroupFilter';
import LabelNumberRange from './labelNumberRange/LabelNumberRange';
import LabelSearchMapSelect from './labelSearchMapSelect/LabelSearchMapSelect';
import LabelTreeSelect from './labelTreeSelect/LabelTreeSelect';
import NormalButton from './normalButton/NormalButton';
import NormalCheckbox from './normalCheckbox/NormalCheckbox';
import NormalString from './normalString/NormalString';
import NormalTag from './normalTag/NormalTag';
import ResidualMaturity from './residualMaturity/ResidualMaturity';
import SwitchIcon from './switchIcon/SwitchIcon';
import TableInputTitle from './tableInputTitle/TableInputTitle';
import TableTitle from './tableTitle/TableTitle';
import TagString from './tagString/TagString';
import TagStringAngle from './tagStringAngle/TagStringAngle';
import TagStringIcon from './tagStringIcon/TagStringIcon';

const components: [string, React.ComponentType<any>][] = [
  ['BondSearch', BondSearch],
  ['LabelFilter', LabelFilter],
  ['LabelFilterInputRange', LabelFilterInputRange],
  ['LabelGroupFilter', LabelGroupFilter],
  ['LabelNumberRange', LabelNumberRange],
  ['LabelSearchMapSelect', LabelSearchMapSelect],
  ['LabelTreeSelect', LabelTreeSelect],
  ['NormalButton', NormalButton],
  ['NormalCheckbox', NormalCheckbox],
  ['NormalString', NormalString],
  ['NormalTag', NormalTag],
  ['ResidualMaturity', ResidualMaturity],
  ['SwitchIcon', SwitchIcon],
  ['TableInputTitle', TableInputTitle],
  ['TableTitle', TableTitle],
  ['TagString', TagString],
  ['TagStringAngle', TagStringAngle],
  ['TagStringIcon', TagStringIcon],
];

const ComponentMap = new Map(components);

export default ComponentMap;

export {SelectComponent, TableTitle};
