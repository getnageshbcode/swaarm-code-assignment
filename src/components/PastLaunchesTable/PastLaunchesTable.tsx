import React, { LegacyRef } from 'react'
import { Input, Table } from 'reactstrap';

interface IShipType {
    name: string;
    home_port: string;
    image: string;
    __typename: string;
}

export interface ILaunchType {
    id: string;
    mission_name: string;
    launch_date_local: string;
    launch_site: {
        site_name_long: string;
        typename: string;
    },
    links: {
        article_link: string;
        video_link: string;
        typename: string;
    },
    rocket: {
        rocket_name: string;
        __typename: string
    },
    ships: IShipType[],
    __typename: string;
}

interface PastLaunchesTableProps {
    launchesPast: ILaunchType[];
    lastLaunchRef: LegacyRef<HTMLTableRowElement> | undefined;
    selectedRows: string[];
    onRowSelect: (id: string) => void;
}

const PastLaunchesTable = (props: PastLaunchesTableProps) => {
    const { launchesPast, lastLaunchRef, selectedRows, onRowSelect } = props;
    const onSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.name);
        const { name } = e.target;
        onRowSelect(name);
    }
    const renderCheckBox = (rowProps: ILaunchType) => {
        const checked = selectedRows.indexOf(rowProps.id) !== -1;
        const disabled = selectedRows.length === 2 && selectedRows.indexOf(rowProps.id) === -1;
        return (
            <Input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={onSelect}
                name={rowProps.id}
            />
        )
    }
    return (
        <>
            <Table>
                <thead>
                    <tr>
                        <th>-</th>
                        <th>Mission name</th>
                        <th>Rocket name</th>
                        <th>Launch time</th>
                        <th>Launch site name</th>
                        <th>Ships</th>
                    </tr>
                </thead>
                <tbody>
                    {launchesPast.length === 0 ? (
                        <tr ref={lastLaunchRef} key={'empty'}>
                            <td className="empty-td" colSpan={5}>No record found.</td>
                        </tr>
                    )
                        : launchesPast?.map((launch: ILaunchType, index: number) => {
                            if (launchesPast.length === index + 1) {
                                return (<tr ref={lastLaunchRef} key={index}>
                                    <td>{renderCheckBox(launch)}</td>
                                    <td>{launch.mission_name}</td>
                                    <td>{launch.rocket.rocket_name}</td>
                                    <td>{launch.launch_date_local}</td>
                                    <td>{launch.launch_site.site_name_long}</td>
                                    <td>{launch.ships.map((ship: any) => ship?.home_port)}</td>
                                </tr>);
                            } else {
                                return (<tr key={index}>
                                    <td>{renderCheckBox(launch)}</td>
                                    <td>{launch.mission_name}</td>
                                    <td>{launch.rocket.rocket_name}</td>
                                    <td>{launch.launch_date_local}</td>
                                    <td>{launch.launch_site.site_name_long}</td>
                                    <td>{launch.ships.map((ship: any) => ship?.name).join(',')}</td>
                                </tr>);
                            }
                        })}
                </tbody>
            </Table>
        </>
    )
}

export default PastLaunchesTable
