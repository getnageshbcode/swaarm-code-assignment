import { gql } from "@apollo/client";

export const getPastLaunchesList = gql`
    query($limit: Int!, $offset: Int!, $searchKey: String) {
        launchesPast(limit:$limit, offset:$offset, find:{mission_name:$searchKey}) {
            id
            mission_name
            launch_date_local
            launch_site {
              site_name_long
            }
            links {
              article_link
              video_link
            }
            rocket {
              rocket_name
            }
            ships {
              name
              home_port
              image
            }
            launch_success
            launch_year
        }
    }
`