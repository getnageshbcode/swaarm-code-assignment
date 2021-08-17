import React, { LegacyRef } from 'react'
import { Table } from 'reactstrap';
interface IShipType {
    name: string;
    home_port: string;
    image: string;
    __typename: string;
}
interface ILaunchType {
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
    lastLaunchRef: LegacyRef<HTMLTableRowElement> | undefined
}

const PastLaunchesTable = (props: PastLaunchesTableProps) => {
    const { launchesPast, lastLaunchRef } = props;
    return (
        <Table>
            <thead>
                <tr>
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
                    : launchesPast?.map((launch: any, index: number) => {
                        if (launchesPast.length === index + 1) {
                            return (<tr ref={lastLaunchRef} key={index}>
                                <td>{launch.mission_name}</td>
                                <td>{launch.rocket.rocket_name}</td>
                                <td>{launch.launch_date_local}</td>
                                <td>{launch.launch_site.site_name_long}</td>
                                <td>{launch.ships.map((ship: any) => ship?.home_port)}</td>
                            </tr>);
                        } else {
                            return (<tr key={index}>
                                <td>{launch.mission_name}</td>
                                <td>{launch.rocket.rocket_name}</td>
                                <td>{launch.launch_date_local}</td>
                                <td>{launch.launch_site.site_name_long}</td>
                                <td>{launch.ships.map((ship: any) => ship?.home_port).join(',')}</td>
                            </tr>);
                        }
                    })}
            </tbody>
        </Table>
    )
}

export default PastLaunchesTable
