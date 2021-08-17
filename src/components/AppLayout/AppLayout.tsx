import React from 'react'
import PastLaunches from '../PastLaunches'

const AppLayout = () => {
    return (
        <div className="container-fluid">
            <div className="row content">
                <div className="col-sm-3 sidenav">
                    {/* TODO */}
                    Side nav menu
                </div>
                <div className="col-sm-9">
                    <div className="row">
                        <div className='top-menu'>Top menu</div>
                    </div>
                    <PastLaunches />
                </div>
            </div>
        </div>
    )
}

export default AppLayout
