import React, { useRef, useCallback, useState, useEffect } from 'react';
import { useQuery } from "@apollo/client";
import { getPastLaunchesList } from "../../queries/query";
import { Card, CardHeader, CardBody, Input, Button } from "reactstrap";
import './style.scss';
import PastLaunchesTable from '../PastLaunchesTable';
import ModalExample from '../RenderModal';
import { ILaunchType } from '../PastLaunchesTable/PastLaunchesTable';
import RenderCompareData from '../RenderCompareData';

const PastLaunches = () => {
    const limit = 10;
    const [searchKey, setSearchKey] = useState("")
    const [hasNextPage, setHasNextPage] = useState(true);
    const observer = useRef<IntersectionObserver>();
    const searchKeyTimer = useRef<ReturnType<typeof setTimeout>>();
    const [selectedRows, setSelectedRows] = useState<string[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);
    const [modalBody, setModalBody] = useState<string | JSX.Element>("")
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

    const onRowSelect = (id: string) => {
        let lSelectedRows: string[] = [...selectedRows];
        const idIndex = lSelectedRows.indexOf(id);
        if (idIndex !== -1) {
            lSelectedRows.splice(idIndex, 1);
        } else {
            lSelectedRows = [...lSelectedRows, id]
        }
        setSelectedRows(lSelectedRows);
    }

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

    const onCompareClick = () => {
        const filteredArr = data.launchesPast.filter((arr: ILaunchType) => {
            return selectedRows.indexOf(arr.id) !== -1
        });
        const modalBody = <RenderCompareData data={filteredArr}/>
        setModalBody(modalBody)
        setShowCompareModal(true);
    }

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
                                selectedRows={selectedRows}
                                onRowSelect={onRowSelect}
                            />
                        </CardBody>
                    </>
                }
            </Card>
            {selectedRows.length === 2 && <div>
                <Button
                    onClick={onCompareClick}
                    className="comp-btn"
                    color="primary"
                    size="lg"
                >
                    Compare
                </Button>
            </div>}

            <ModalExample 
                modalBody={modalBody} 
                isOpen={showCompareModal} 
                onHide={() => setShowCompareModal(false)}
                modalFooter={
                    <div> <Button onClick={() => setShowCompareModal(false)}>Close</Button></div>
                }
                modalTitle="Past launches comparison"
                className='compare-modal'
            />
        </div>
    )
}

export default PastLaunches
