import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { getPastLaunchesList } from "../../queries/query";
import { Card, CardHeader, CardBody, Input } from "reactstrap";
import './style.scss';
import PastLaunchesTable from '../PastLaunchesTable';

const PastLaunches = () => {
    const limit = 10;
    const [searchKey, setSearchKey] = useState("")
    const [hasNextPage, setHasNextPage] = useState(true);
    const observer = useRef<IntersectionObserver>();
    const searchKeyTimer = useRef<ReturnType<typeof setTimeout>>();
    let offsetRef = useRef<number>(0);
    const { loading, error, data, fetchMore } = useQuery(getPastLaunchesList, {
        variables: {
            limit,
            offset: 0,
            searchKey: '',
        }
    });
    const lastLaunchRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries => {
                if (entries[0].isIntersecting && hasNextPage) {
                    offsetRef.current = offsetRef.current + 1;
                    fetchMore({
                        variables: {
                            limit,
                            offset: offsetRef.current,
                            searchKey
                        },
                        updateQuery: (pv, { fetchMoreResult }) => {
                            if (!fetchMoreResult) {
                                return pv;
                            }
                            if (fetchMoreResult.launchesPast.length < limit) {
                                setHasNextPage(false)
                            }
                            return {
                                launchesPast: [
                                    ...pv.launchesPast,
                                    ...fetchMoreResult.launchesPast,
                                ]
                            }
                        }
                    })
                }
            }));
            if (node) observer.current.observe(node);
        },
        [searchKey, loading, fetchMore, hasNextPage],
    );
    useEffect(() => {
        if (data?.launchesPast?.length < limit) {
            setHasNextPage(false);
        } else {
            setHasNextPage(true);
        }
    }, [data]);

    const onSearch = useCallback(
        () => {
            fetchMore({
                variables: {
                    limit,
                    offset: offsetRef.current,
                    searchKey: searchKey
                },
                updateQuery: (pv, { fetchMoreResult }) => {
                    return fetchMoreResult;
                }
            });
        },
        [searchKey, offsetRef, fetchMore],
    )

    if (error) return <p>Error</p>;

    const onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (searchKeyTimer.current) {
            clearTimeout(searchKeyTimer.current);
        }
        searchKeyTimer.current = setTimeout(
            onSearch,
            1000
        );
    };

    return (
        <div className="pl-tbl-div">
            <Card>
                {loading ? <CardBody className="ldng">Loading ...</CardBody> :
                    <>
                        <CardHeader>
                            <div className="title">Post launches</div>
                            <div className="srch-cntnr">
                                <Input
                                    type="text"
                                    name="search"
                                    id="searchPastLaunches"
                                    placeholder="Search by mission name"
                                    onKeyUp={onKeyUp}
                                    onChange={(e) => setSearchKey(e.target.value)}
                                    value={searchKey}
                                />
                            </div>
                        </CardHeader>
                        <CardBody>
                            <PastLaunchesTable
                                lastLaunchRef={lastLaunchRef}
                                launchesPast={data?.launchesPast ? data?.launchesPast : []}
                            />
                        </CardBody>
                    </>
                }
            </Card>
        </div>
    )
}

export default PastLaunches
