import React from 'react';
import { SearchOutlined } from '@ant-design/icons';
import Input from '@iso/components/uielements/input';
import IntlMessages from '../../../@crema/utility/IntlMessages';
import Button from '@iso/components/uielements/button';

function GetColumnSearchProps(dataIndex, type) {
	let onFilter = (value, record) => record[dataIndex].toString().toLowerCase().includes(value.toLowerCase());

	return {
		filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
			<div style={{ padding: 8 }}>
				<Input
					placeholder="Search"
					value={selectedKeys ? selectedKeys[0] : ''}
					onChange={(e) => setSelectedKeys(e.target.value ? [ e.target.value ] : [])}
					onPressEnter={() => confirm()}
					style={{ width: 188, marginBottom: 8, display: 'block' }}
				/>
				<Button
					type="primary"
					onClick={() => confirm()}
					icon={<SearchOutlined />}
					size="small"
					style={{ width: 90, marginRight: 8 }}
				>
					<IntlMessages id="Search" />
				</Button>
				<Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
					<IntlMessages id="Reset" />
				</Button>
			</div>
		),
		filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#bf1200' : undefined }} />,
		onFilter: type === 'default' ? onFilter : undefined
	};
}

export default GetColumnSearchProps;
