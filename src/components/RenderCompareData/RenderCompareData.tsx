import React from 'react';
import { Table } from 'reactstrap';
interface IRenderCompareDataProps {
    data: any;
}
const compareFactors = [
    {
        compare_factor: 'Launch date',
        key: 'launch_date_local'
    },
    {
        compare_factor: 'Launch site name',
        key: 'launch_site',
        subkey: 'site_name_long'
    },
    {
        compare_factor: 'Mission name',
        key: 'mission_name'
    },
    {
        compare_factor: 'Rocket name',
        key: 'rocket',
        subkey: 'rocket_name'
    },
    {
        compare_factor: 'Launch success',
        key: 'launch_success'
    },
    {
        compare_factor: 'Launch year',
        key: 'launch_year'
    }
]
const RenderCompareData = (props: IRenderCompareDataProps) => {
    return (
        <Table>
            <thead>
                <tr>
                    <th>Factors</th>
                    <th> </th>
                    <th> </th>
                </tr>
            </thead>
            <tbody>
                {compareFactors.map(factor => {
                    return <tr>
                        <td>{factor.compare_factor}</td>
                        <>
                            {props.data.map((item: any) => {
                                return <td>{
                                    factor.subkey ?
                                        item[factor.key][factor.subkey].toString() : item[factor.key].toString()
                                }
                                </td>
                            })}
                        </>
                    </tr>
                })}
            </tbody>
        </Table>
    )
}

export default RenderCompareData
